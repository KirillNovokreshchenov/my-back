import {Router, Request, Response} from "express";
import {
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithQuery,
    RequestWithQueryAndParams
} from "../types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {blogsService} from "../domain/blogs-service";
import {CreateAndUpdateBlogInputModel} from "../models/blog-models/CreateAndUpdateBlogInputModel";
import {BlogViewModel} from "../models/blog-models/BlogViewModel";
import {blogValidate, foundBlogForCreatePost} from "../middlewares/blog-middlewares";
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


export const blogRouter = Router()


blogRouter.get('/', async (req: RequestWithQuery<QueryInputModel>, res: Response<QueryViewModel<BlogViewModel>>) => {
    const allBlogs =  await blogsQueryRepository.allBlogs(req.query)
    res.json(allBlogs)
})

blogRouter.get('/:id/posts',
    mongoIdMiddleware,
    async (req: RequestWithQueryAndParams<URIParamsId, QueryInputModel>, res: Response<QueryViewModel<PostViewModel>>)=>{
    const allPostsForBlog= await blogsQueryRepository.allPostsForBlog(req.params.id, req.query)
    if (!allPostsForBlog) {
        res.sendStatus(404)
    } else {
        res.send(allPostsForBlog)
    }
})

blogRouter.post('/',
    blogValidate,
    async (req: RequestWithBody<CreateAndUpdateBlogInputModel>, res: Response<BlogViewModel>) => {
        const idBlog = await blogsService.createBlog(req.body)
        const newBlog = await blogsQueryRepository.findBlog(idBlog)
        res.status(201).send(newBlog!)
    })

blogRouter.post('/:id/posts',
    postValidateForBlog,
    async (req: RequestWithBodyAndParams<URIParamsId, CreateModelPostForBlog>, res: Response<PostViewModel>) => {
        const idPost = await blogsService.createPostForBlog(req.params.id, req.body)
        const foundNewPost = await postsQueryRepository.findPost(idPost)
        res.status(201).send(foundNewPost!)

    })

blogRouter.get('/:id',
    mongoIdMiddleware,
    async (req: RequestWithParams<URIParamsId>, res: Response<BlogViewModel>) => {
    const foundBlog = await blogsQueryRepository.findBlog(formatIdInObjectId(req.params.id))
    if (foundBlog) {
        res.send(foundBlog)
    } else {
        res.sendStatus(404)
    }
})

blogRouter.put('/:id',
    blogValidate,
    mongoIdMiddleware,
    async (req: RequestWithBodyAndParams<URIParamsId, CreateAndUpdateBlogInputModel>, res: Response) => {
        const isUpdate: boolean = await blogsService.updateBlog(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

blogRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    async (req: RequestWithParams<URIParamsId>, res: Response) => {
        const isDeleted: boolean = await blogsService.deleteBlog(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

