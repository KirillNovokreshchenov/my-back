import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {blogsRepository} from "../repositories/blogs-repository";
import {CreateAndUpdateBlogModel} from "../models/blog-models/CreateAndUpdateBlogModel";
import {BlogViewModel} from "../models/blog-models/BlogViewModel";
import {blogValidate} from "../middlewares/blog-middlewares";
import {authorizationValidation} from "../middlewares/auth-middleware";



export const blogRouter = Router()


blogRouter.get('/', async (req: Request, res: Response<Array<BlogViewModel>>) => {
    const allBlogs = await blogsRepository.allBlogs()
    res.send(allBlogs)
})

blogRouter.post('/',
    blogValidate,
    async (req: RequestWithBody<CreateAndUpdateBlogModel>, res: Response<BlogViewModel>) => {
        const newBlog = await blogsRepository.createBlog(req.body)
        res.status(201).send(newBlog)
    })

blogRouter.get('/:id([0-9]+)', async (req: RequestWithParams<URIParamsId>, res: Response<BlogViewModel>) => {
    const foundBlog = await blogsRepository.findBlog(req.params.id)
    if (foundBlog) {
        res.send(foundBlog)
    } else {
        res.sendStatus(404)
    }
})

blogRouter.put('/:id([0-9]+)',
    blogValidate,
    async (req: RequestWithBodyAndParams<URIParamsId, CreateAndUpdateBlogModel>, res: Response) => {
        const isUpdate: boolean = await blogsRepository.updateBlog(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

blogRouter.delete('/:id([0-9]+)',
    authorizationValidation,
    async (req: RequestWithParams<URIParamsId>, res: Response) => {
        const isDeleted: boolean = await blogsRepository.deleteBlog(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

