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
import {commentsService, RESPONSE_OPTIONS} from "../domain/comments-service";
import {errorsValidationMiddleware} from "../middlewares/err-middleware";
import {RESPONSE_STATUS} from "../types/resStatus";


export const commentRouter = Router()

const switchResponseComment = (condition: RESPONSE_OPTIONS, res: Response) => {
    switch (condition) {
        case RESPONSE_OPTIONS.NOT_FOUND:
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
            break;
        case RESPONSE_OPTIONS.FORBIDDEN:
            res.sendStatus(RESPONSE_STATUS.FORBIDDEN_403)
            break
        case RESPONSE_OPTIONS.NO_CONTENT:
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
            break
    }
}

commentRouter.get('/:id',
    mongoIdMiddleware,
    async (req: RequestWithParams<URIParamsId>, res: Response<CommentViewModel>) => {
        const comment = await queryCommentsRepository.findComment(formatIdInObjectId(req.params.id))
        if (!comment) {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        } else {
            res.send(comment)
        }
    })

commentRouter.put('/:id',
    jwtMiddleware,
    mongoIdMiddleware,
    contentValidation,
    errorsValidationMiddleware,
    async (req: RequestWithBodyAndParams<URIParamsId, CommentCreateAndUpdateModel>, res: Response) => {
        const isUpdate = await commentsService.updateComment(req.params.id, req.body.content, req.user!._id)
        switchResponseComment(isUpdate, res)
    })

commentRouter.delete('/:id',
    jwtMiddleware,
    mongoIdMiddleware,
    async (req: RequestWithParams<URIParamsId>, res: Response) => {
        const isDeleted = await commentsService.deleteComment(req.params.id, req.user!._id)
        switchResponseComment(isDeleted, res)
    })