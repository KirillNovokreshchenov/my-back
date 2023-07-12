import {QueryCommentsRepository} from "../repositories/query-comments-repository";
import {CommentsService} from "../domain/comments-service";
import {RequestWithBodyAndParams, RequestWithParams} from "../types/types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {Response} from "express";
import {CommentViewModel} from "../models/comment-models/CommentViewModel";
import {ObjectId} from "mongodb";
import {RESPONSE_OPTIONS, RESPONSE_STATUS} from "../types/res-status";
import {CommentCreateAndUpdateModel} from "../models/comment-models/CommentCreateAndUpdateModel";
import {LikeStatusInputModel} from "../models/comment-models/LikeStatusInputModel";


export class CommentsController {

    constructor(protected queryCommentsRepository: QueryCommentsRepository,
                protected commentsService: CommentsService) {

    }


    async getComment(req: RequestWithParams<URIParamsId>, res: Response<CommentViewModel>) {
        const comment = await this.queryCommentsRepository.findComment(new ObjectId(req.params.id), req.user?._id)
        if (!comment) {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        } else {
            res.send(comment)
        }
    }

    async updateComment(req: RequestWithBodyAndParams<URIParamsId, CommentCreateAndUpdateModel>, res: Response) {
        const isUpdate = await this.commentsService.updateComment(req.params.id, req.body.content, req.user!._id)
        this._switchResponseComment(isUpdate, res)
    }

    async deleteComment(req: RequestWithParams<URIParamsId>, res: Response) {

        const isDeleted = await this.commentsService.deleteComment(req.params.id, req.user!._id)
        this._switchResponseComment(isDeleted, res)
    }

    async likeStatus(req: RequestWithBodyAndParams<URIParamsId, LikeStatusInputModel>, res: Response){
        const likeStatus = await this.commentsService.updateLikeStatus(req.params.id, req.body.likeStatus, req.user!._id)
        if(!likeStatus){
            return res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
        return res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
    }


    _switchResponseComment(condition: RESPONSE_OPTIONS, res: Response) {
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
}