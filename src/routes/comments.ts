import {Response, Router} from "express";
import {RequestWithBodyAndParams, RequestWithParams} from "../types/types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {CommentViewModel} from "../models/comment-models/CommentViewModel";
import {queryCommentsRepository} from "../repositories/query-comments-repository";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {jwtMiddleware} from "../middlewares/auth-jwt-middleware";
import {contentValidation} from "../middlewares/comment-middleware";
import {CommentCreateAndUpdateModel} from "../models/comment-models/CommentCreateAndUpdateModel";
import {commentsService, ResponseOptions} from "../domain/comments-service";


export const commentRouter = Router()

commentRouter.get('/:id',
    mongoIdMiddleware,
    async (req: RequestWithParams<URIParamsId>, res: Response<CommentViewModel>)=>{
    const comment = await queryCommentsRepository.findComment(formatIdInObjectId(req.params.id))
    if(!comment){
        res.sendStatus(404)
    } else {
        res.send(comment)
    }
})

commentRouter.put('/:id',
    jwtMiddleware,
    mongoIdMiddleware,
    contentValidation,
    async (req: RequestWithBodyAndParams<URIParamsId, CommentCreateAndUpdateModel>, res: Response)=>{
    const isUpdate = await commentsService.updateComment(req.params.id, req.body.content, req.user!._id)
        switch (isUpdate) {
            case ResponseOptions.NOT_FOUND: res.sendStatus(404)
                break;
            case ResponseOptions.FORBIDDEN: res.sendStatus(403)
                break
            case ResponseOptions.NO_CONTENT: res.sendStatus(204)
        }
    })

commentRouter.delete('/:id',
    jwtMiddleware,
    mongoIdMiddleware,
    async (req: RequestWithParams<URIParamsId>, res: Response)=>{
    const isDeleted = await commentsService.deleteComment(req.params.id, req.user!._id)
        switch (isDeleted) {
            case ResponseOptions.NOT_FOUND: res.sendStatus(404)
                break;
            case ResponseOptions.FORBIDDEN: res.sendStatus(403)
                break
            case ResponseOptions.NO_CONTENT: res.sendStatus(204)
        }
})