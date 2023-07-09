import {Response, Router} from "express";
import {RequestWithBodyAndParams, RequestWithParams} from "../types/types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {CommentViewModel} from "../models/comment-models/CommentViewModel";
import {QueryCommentsRepository} from "../repositories/query-comments-repository";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {jwtMiddleware} from "../middlewares/auth-jwt-middleware";
import {contentValidation} from "../middlewares/comment-middleware";
import {CommentCreateAndUpdateModel} from "../models/comment-models/CommentCreateAndUpdateModel";
import {CommentsService} from "../domain/comments-service";
import {errorsValidationMiddleware} from "../middlewares/err-middleware";
import {RESPONSE_OPTIONS, RESPONSE_STATUS} from "../types/res-status";
import {ObjectId} from "mongodb";


export const commentRouter = Router()

class CommentsController{

    private queryCommentsRepository: QueryCommentsRepository
    private commentsService: CommentsService

    constructor() {
        this.commentsService = new CommentsService()
        this.queryCommentsRepository = new QueryCommentsRepository()
    }


    async getComment(req: RequestWithParams<URIParamsId>, res: Response<CommentViewModel>) {
        const comment = await  this.queryCommentsRepository.findComment(new ObjectId(req.params.id))
        if (!comment) {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        } else {
            res.send(comment)
        }
    }

    async updateComment(req: RequestWithBodyAndParams<URIParamsId, CommentCreateAndUpdateModel>, res: Response) {
        const isUpdate = await  this.commentsService.updateComment(req.params.id, req.body.content, req.user!._id)
        this._switchResponseComment(isUpdate, res)
    }

    async deleteComment(req: RequestWithParams<URIParamsId>, res: Response) {

        const isDeleted = await  this.commentsService.deleteComment(req.params.id, req.user!._id)
        this._switchResponseComment(isDeleted, res)
    }


    _switchResponseComment(condition: RESPONSE_OPTIONS, res: Response) {
        switch (condition) {
            case RESPONSE_OPTIONS.NOT_FOUND:
                res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
                break;
            case RESPONSE_OPTIONS.FORBIDDEN:
                res.sendStatus (RESPONSE_STATUS.FORBIDDEN_403)
                break
            case RESPONSE_OPTIONS.NO_CONTENT:
                res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
                break
        }
    }
}

const commentsController = new CommentsController()



commentRouter.get('/:id',
    mongoIdMiddleware,
    commentsController.getComment.bind(commentsController))

commentRouter.put('/:id',
    jwtMiddleware,
    mongoIdMiddleware,
    contentValidation,
    errorsValidationMiddleware,
    commentsController.updateComment.bind(commentsController))

commentRouter.delete('/:id',
    jwtMiddleware,
    mongoIdMiddleware,
    commentsController.deleteComment.bind(commentsController))