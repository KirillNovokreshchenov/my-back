import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {blogType} from "../db/db-blogs";
import {blogsRepository} from "../repositories/blogs-repository";
import {CreateAndUpdateBlogModel} from "../models/blog-models/CreateAndUpdateBlogModel";
import {BlogViewModel} from "../models/blog-models/BlogViewModel";
import {
    authorizationValidation,
    descriptionValidation,
    errorsValidationMiddleware,
    nameValidation,
    websiteUrlValidation
} from "../middlewares/blog-middlewares";


export const blogRouter = Router()

blogRouter.get('/', (req: RequestWithParams<URIParamsId>, res: Response<Array<blogType>>)=>{
    const allBlogs = blogsRepository.allBlogs()
      res.send(allBlogs)
})

blogRouter.post('/',
    authorizationValidation,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    errorsValidationMiddleware,
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
    authorizationValidation,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    errorsValidationMiddleware,
    (req: RequestWithBodyAndParams<URIParamsId, CreateAndUpdateBlogModel>, res: Response)=>{
    const isUpdate = blogsRepository.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
    if(isUpdate){
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogRouter.delete('/:id([0-9]+)',
    authorizationValidation,
    (req: RequestWithParams<URIParamsId>, res: Response)=>{
    const isDeleted = blogsRepository.deleteBlog(req.params.id)
    if(isDeleted){
        res.sendStatus(204)
    }else{
        res.sendStatus(404)
    }
})

