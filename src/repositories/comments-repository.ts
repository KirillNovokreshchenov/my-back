import {CommentType} from "../db/db-comments-type";
import {collectionComments} from "../db/db";
import {ObjectId} from "mongodb";
import {CommentModelClass} from "../db/schemas/schema-comment";

export const commentsRepository = {
    async createComment(newComment: CommentType): Promise<ObjectId>{
        await CommentModelClass.create(newComment)
        return newComment._id
    },
    async updateComment(id:ObjectId, content: string): Promise<void>{
        await CommentModelClass.updateOne({_id: id}, {$set: {content: content}})

    },

    async deleteComment(id: ObjectId): Promise<void>{
        await CommentModelClass.deleteOne({_id: id})
    }
}