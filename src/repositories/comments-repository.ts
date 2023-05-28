import {CommentType} from "../db/db-comments-type";
import {collectionComments} from "../db/db";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async createComment(newComment: CommentType): Promise<ObjectId>{
        await collectionComments.insertOne(newComment)
        return newComment._id
    },
    async updateComment(id:ObjectId, content: string): Promise<void>{
        await collectionComments.updateOne({_id: id}, {$set: {content: content}})
    },

    async deleteComment(id: ObjectId): Promise<void>{
        await collectionComments.deleteOne({_id: id})
    }
}