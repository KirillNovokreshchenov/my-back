import {Router, Response} from "express";
import {
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithQuery,
    RequestWithQueryAndParams
} from "../types/types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {BlogsService} from "../domain/blogs-service";
import {CreateAndUpdateBlogInputModel} from "../models/blog-models/CreateAndUpdateBlogInputModel";
import {BlogViewModel} from "../models/blog-models/BlogViewModel";
import {blogValidate} from "../middlewares/blog-middlewares";
import {authorizationValidation} from "../middlewares/auth-middleware";
import {QueryBlogsRepository} from "../repositories/query-blogs-repository";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {CreateModelPostForBlog} from "../models/blog-models/CreateModelPostForBlog";
import {PostsQueryRepository} from "../repositories/query-posts-repository";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {postValidateForBlog} from "../middlewares/post-middleware";
import {QueryInputModel} from "../models/QueryInputModel";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {QueryViewModel} from "../models/QueryViewModel";
import {RESPONSE_STATUS} from "../types/res-status";
import {ObjectId} from "mongodb";


export const blogRouter = Router()

class BlogsController {

    private blogsQueryRepository: QueryBlogsRepository
    private blogsService: BlogsService
    private postsQueryRepository: PostsQueryRepository

    constructor() {
        this.blogsService = new BlogsService()
        this.blogsQueryRepository = new QueryBlogsRepository()
        this.postsQueryRepository = new PostsQueryRepository()
    }


    async getBlogs(req: RequestWithQuery<QueryInputModel>, res: Response<QueryViewModel<BlogViewModel>>) {
        const allBlogs = await this.blogsQueryRepository.allBlogs(req.query)
        res.json(allBlogs)
    }

    async getAllPostsForBlog(req: RequestWithQueryAndParams<URIParamsId, QueryInputModel>, res: Response<QueryViewModel<PostViewModel>>) {

        const blogIsExists = this.blogsQueryRepository.findBlog(new ObjectId(req.params.id))
        if (!blogIsExists) return res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)

        const allPostsForBlog = await this.postsQueryRepository.allPosts(req.query, req.params.id)
        return res.send(allPostsForBlog)
    }

    async createBlog(req: RequestWithBody<CreateAndUpdateBlogInputModel>, res: Response<BlogViewModel>) {
        const idBlog = await this.blogsService.createBlog(req.body)
        const newBlog = await this.blogsQueryRepository.findBlog(idBlog)
        if (!newBlog) {
            res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
            return
        }
        res.status(RESPONSE_STATUS.CREATED_201).send(newBlog)
    }

    async createPostForBlog(req: RequestWithBodyAndParams<URIParamsId, CreateModelPostForBlog>, res: Response<PostViewModel>) {

        const idPost = await this.blogsService.createPostForBlog(req.params.id, req.body)
        if (!idPost) {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
            return
        }
        const foundNewPost = await this.postsQueryRepository.findPost(idPost)

        if (!foundNewPost) {
            res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
            return
        }
        res.status(RESPONSE_STATUS.CREATED_201).send(foundNewPost)

    }

    async getBlogById(req: RequestWithParams<URIParamsId>, res: Response<BlogViewModel>) {
        const foundBlog = await this.blogsQueryRepository.findBlog(formatIdInObjectId(req.params.id))
        if (foundBlog) {
            res.send(foundBlog)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

    async updateBlog(req: RequestWithBodyAndParams<URIParamsId, CreateAndUpdateBlogInputModel>, res: Response) {
        const isUpdate: boolean = await this.blogsService.updateBlog(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

    async deleteBlog(req: RequestWithParams<URIParamsId>, res: Response) {
        const isDeleted: boolean = await this.blogsService.deleteBlog(req.params.id)
        if (isDeleted) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

}

const blogsController = new BlogsController()


blogRouter.get('/', blogsController.getBlogs.bind(blogsController))

blogRouter.get('/:id/posts',
    mongoIdMiddleware,
    blogsController.getAllPostsForBlog.bind(blogsController))

blogRouter.post('/',
    blogValidate,
    blogsController.createBlog.bind(blogsController))


blogRouter.post('/:id/posts',
    postValidateForBlog,
    blogsController.createPostForBlog.bind(blogsController))


blogRouter.get('/:id',
    mongoIdMiddleware,
    blogsController.getBlogById.bind(blogsController))

blogRouter.put('/:id',
    blogValidate,
    mongoIdMiddleware,
    blogsController.updateBlog.bind(blogsController)
)

blogRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    blogsController.deleteBlog.bind(blogsController))

