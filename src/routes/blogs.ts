import {Router, Request, Response} from "express";
import {
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithQuery,
    RequestWithQueryAndParams
} from "../types/types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {blogsService} from "../domain/blogs-service";
import {CreateAndUpdateBlogInputModel} from "../models/blog-models/CreateAndUpdateBlogInputModel";
import {BlogViewModel} from "../models/blog-models/BlogViewModel";
import {blogValidate} from "../middlewares/blog-middlewares";
import {authorizationValidation} from "../middlewares/auth-middleware";
import {blogsQueryRepository} from "../repositories/query-blogs-repository";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {CreateModelPostForBlog} from "../models/blog-models/CreateModelPostForBlog";
import {postsQueryRepository} from "../repositories/query-posts-repository";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {postValidateForBlog} from "../middlewares/post-middleware";
import {QueryInputModel} from "../models/QueryInputModel";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {QueryViewModel} from "../models/QueryViewModel";
import {RESPONSE_STATUS} from "../types/res-status";
import {ObjectId} from "mongodb";


export const blogRouter = Router()

class BlogsController {
    async getBlogs(req: RequestWithQuery<QueryInputModel>, res: Response<QueryViewModel<BlogViewModel>>) {
        const allBlogs = await blogsQueryRepository.allBlogs(req.query)
        res.json(allBlogs)
    }

    async getAllPostsForBlog(req: RequestWithQueryAndParams<URIParamsId, QueryInputModel>, res: Response<QueryViewModel<PostViewModel>>) {

        const blogIsExists = blogsQueryRepository.findBlog(new ObjectId(req.params.id))
        if (!blogIsExists) return res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)

        const allPostsForBlog = await postsQueryRepository.allPosts(req.query, req.params.id)
        return res.send(allPostsForBlog)
    }

    async createBlog(req: RequestWithBody<CreateAndUpdateBlogInputModel>, res: Response<BlogViewModel>) {
        const idBlog = await blogsService.createBlog(req.body)
        const newBlog = await blogsQueryRepository.findBlog(idBlog)
        if (!newBlog) {
            res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
            return
        }
        res.status(RESPONSE_STATUS.CREATED_201).send(newBlog)
    }

    async createPostForBlog(req: RequestWithBodyAndParams<URIParamsId, CreateModelPostForBlog>, res: Response<PostViewModel>) {

        const idPost = await blogsService.createPostForBlog(req.params.id, req.body)
        if (!idPost) {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
            return
        }
        const foundNewPost = await postsQueryRepository.findPost(idPost)

        if (!foundNewPost) {
            res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
            return
        }
        res.status(RESPONSE_STATUS.CREATED_201).send(foundNewPost)

    }

    async getBlogById(req: RequestWithParams<URIParamsId>, res: Response<BlogViewModel>) {
        const foundBlog = await blogsQueryRepository.findBlog(formatIdInObjectId(req.params.id))
        if (foundBlog) {
            res.send(foundBlog)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

    async updateBlog(req: RequestWithBodyAndParams<URIParamsId, CreateAndUpdateBlogInputModel>, res: Response) {
        const isUpdate: boolean = await blogsService.updateBlog(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

    async deleteBlog(req: RequestWithParams<URIParamsId>, res: Response) {
        const isDeleted: boolean = await blogsService.deleteBlog(req.params.id)
        if (isDeleted) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

}

const blogsController = new BlogsController()


blogRouter.get('/', blogsController.getBlogs)

blogRouter.get('/:id/posts',
    mongoIdMiddleware,
    blogsController.getAllPostsForBlog)

blogRouter.post('/',
    blogValidate,
    blogsController.createBlog)


blogRouter.post('/:id/posts',
    postValidateForBlog,
    blogsController.createPostForBlog)


blogRouter.get('/:id',
    mongoIdMiddleware,
    blogsController.getBlogById)

blogRouter.put('/:id',
    blogValidate,
    mongoIdMiddleware,
    blogsController.updateBlog
)

blogRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    blogsController.deleteBlog)

