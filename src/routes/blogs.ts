import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {blogsRepository} from "../repositories/blogs-repository";
import {CreateAndUpdateBlogModel} from "../models/blog-models/CreateAndUpdateBlogModel";
import {BlogViewModel} from "../models/blog-models/BlogViewModel";
import {blogValidate} from "../middlewares/blog-middlewares";
import {authorizationValidation} from "../middlewares/auth-middleware";



export const blogRouter = Router()


blogRouter.get('/', (req: Request, res: Response<Array<BlogViewModel>>)=>{
    const allBlogs = blogsRepository.allBlogs()
      res.send(allBlogs)
})

blogRouter.post('/',
    blogValidate,
    (req: RequestWithBody<CreateAndUpdateBlogModel>, res: Response<BlogViewModel>)=>{
    const newBlog = blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
    res.status(201).send(newBlog)
})

blogRouter.get('/:id([0-9]+)', (req: RequestWithParams<URIParamsId>, res: Response<BlogViewModel>)=>{
    const foundBlog = blogsRepository.findBlog(req.params.id)
    if(foundBlog){
        res.send(foundBlog)
    } else {
        res.sendStatus(404)
    }
})

blogRouter.put('/:id([0-9]+)',
    blogValidate,
    (req: RequestWithBodyAndParams<URIParamsId, CreateAndUpdateBlogModel>, res: Response)=>{
    const isUpdate: boolean = blogsRepository.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
    if(isUpdate){
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogRouter.delete('/:id([0-9]+)',
    authorizationValidation,
    (req: RequestWithParams<URIParamsId>, res: Response)=>{
    const isDeleted: boolean = blogsRepository.deleteBlog(req.params.id)
    if(isDeleted){
        res.sendStatus(204)
    }else{
        res.sendStatus(404)
    }
})

