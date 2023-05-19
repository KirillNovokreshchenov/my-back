import {Request, Router, Response} from "express";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams, RequestWithQuery} from "../types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {postValidate} from "../middlewares/post-middleware";
import {authorizationValidation} from "../middlewares/auth-middleware";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/query-posts-repository";
import {mongoIdMiddleware} from "../middlewares/objId-middleware";
import {PostQueryViewModel} from "../models/post-models/PostQueryViewModel";
import {QueryModel} from "../models/QueryModel";


export const postRouter = Router()

postRouter.get('/', async (req: RequestWithQuery<QueryModel>, res: Response<PostQueryViewModel>) => {
    const allPosts = await postsQueryRepository.allPosts(req.query)
    res.send(allPosts)
})

postRouter.post('/',
   postValidate,
    async (req: RequestWithBody<CreateAndUpdatePostModel>, res: Response<PostViewModel>) => {
        const objId = await postsService.createPost(req.body)
        const foundNewCreatePost = await postsQueryRepository.findPost(objId)
        res.status(201).send(foundNewCreatePost!)
    })

postRouter.get('/:id',
    mongoIdMiddleware,
    async (req: RequestWithParams<URIParamsId>, res: Response<PostViewModel>) => {
    const foundPost = await postsQueryRepository.findPost(req.params.id)
    if (foundPost) {
        res.send(foundPost)
    } else {
        res.sendStatus(404)
    }
})

postRouter.put('/:id',
    postValidate,
    mongoIdMiddleware,
    async (req: RequestWithBodyAndParams<URIParamsId, CreateAndUpdatePostModel>, res: Response) => {
        const isUpdate = await postsService.updatePost(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

postRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    async (req: RequestWithParams<URIParamsId>, res: Response) => {
        const isDeleted: boolean = await postsService.deletePost(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

