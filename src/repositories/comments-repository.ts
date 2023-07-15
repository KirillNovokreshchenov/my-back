import {CommentType, LikeStatus} from "../db/db-comments-type";

import {ObjectId} from "mongodb";
import {CommentModelClass, LikeStatusClass} from "../db/schemas/schema-comment";
import {LIKE_STATUS} from "../models/comment-models/EnumLikeStatusModel";
import {CommentViewModel} from "../models/comment-models/CommentViewModel";


export class CommentsRepository {

    async findComment(commentId: ObjectId, userId?: ObjectId): Promise<CommentType | null> {
        return CommentModelClass.findOne({_id: commentId})
    }

    async createComment(newComment: CommentType): Promise<ObjectId> {
        await CommentModelClass.create(newComment)
        return newComment._id
    }

    async updateComment(id: ObjectId, content: string): Promise<void> {
        await CommentModelClass.updateOne({_id: id}, {$set: {content: content}})

    }

    async deleteComment(id: ObjectId): Promise<void> {
        await CommentModelClass.deleteOne({_id: id})
    }

    async getLikeStatus(commentId: ObjectId, userId: ObjectId): Promise<LikeStatus|null> {
        return LikeStatusClass.findOne({$and:[{commentId: commentId},{ userId: userId}]})
    }

    async createLikeStatus(newLikeStatus: LikeStatus, inputLikeStatus: LIKE_STATUS, commentId: ObjectId){
        await LikeStatusClass.create(newLikeStatus)
        if(inputLikeStatus===LIKE_STATUS.LIKE){
            await CommentModelClass.updateOne({_id: commentId}, {$inc: {"likesInfo.likes": 1}})
        } else {
            await CommentModelClass.updateOne({_id: commentId}, {$inc: {"likesInfo.dislikes": 1}})
        }
    }

    async deleteLikeStatus(commentId: ObjectId, userId: ObjectId, existingLikeStatus: LIKE_STATUS){
        await LikeStatusClass.deleteOne({$and:[{commentId: commentId},{ userId: userId}]})
        if(existingLikeStatus===LIKE_STATUS.LIKE){
            await CommentModelClass.updateOne({_id: commentId}, {$inc: {"likesInfo.likes": -1}})
        } else {
            await CommentModelClass.updateOne({_id: commentId}, {$inc: {"likesInfo.dislikes": -1}})
        }
    }
    async updateLikeStatus(commentId: ObjectId, userId: ObjectId, likeStatus: LIKE_STATUS){
        await LikeStatusClass.updateOne({$and:[{commentId: commentId},{ userId: userId}]}, {$set:{likeStatus: likeStatus}})
        if(likeStatus === LIKE_STATUS.LIKE){
            await CommentModelClass.updateOne({_id: commentId}, {$inc: {"likesInfo.likes": 1, "likesInfo.dislikes": -1}})
        } else {
            await CommentModelClass.updateOne({_id: commentId}, {$inc: {"likesInfo.likes": -1, "likesInfo.dislikes": 1}})
        }

    }
}

