import {Request, Router, Response} from "express";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {postsRepository} from "../repositories/posts-repository";
import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/post-middleware";
import {authorizationValidation, errorsValidationMiddleware} from "../middlewares/common-middleware";


export const postRouter = Router()

postRouter.get('/', (req: Request, res: Response<Array<PostViewModel>>)=>{
    const allPosts = postsRepository.allPosts()
      res.send(allPosts)
})

postRouter.post('/',
    authorizationValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    errorsValidationMiddleware,
    (req: RequestWithBody<CreateAndUpdatePostModel>, res: Response<PostViewModel>)=>{
    const newPost = postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    res.status(201).send(newPost)
})

postRouter.get('/:id([0-9]+)', (req: RequestWithParams<URIParamsId>, res: Response<PostViewModel>)=>{
    const foundPost = postsRepository.findPost(req.params.id)
    if(foundPost){
        res.send(foundPost)
    } else {
        res.sendStatus(404)
    }
})

postRouter.put('/:id([0-9]+)',
    authorizationValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    errorsValidationMiddleware,
    (req: RequestWithBodyAndParams<URIParamsId, CreateAndUpdatePostModel>, res: Response)=>{
    const isUpdate: boolean = postsRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content)
    if(isUpdate){
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

postRouter.delete('/:id([0-9]+)',
    authorizationValidation,
    (req: RequestWithParams<URIParamsId>, res: Response)=>{
    const isDeleted: boolean = postsRepository.deletePost(req.params.id)
    if(isDeleted){
        res.sendStatus(204)
    }else{
        res.sendStatus(404)
    }
})

