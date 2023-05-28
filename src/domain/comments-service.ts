import {ObjectId} from "mongodb";
import {postsQueryRepository} from "../repositories/query-posts-repository";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {UserType} from "../db/db-users-type";
import {CommentType} from "../db/db-comments-type";
import {commentsRepository} from "../repositories/comments-repository";
import {queryCommentsRepository} from "../repositories/query-comments-repository";

export enum ResponseOptions{
    NO_CONTENT = 'No Content',
    FORBIDDEN = 'Forbidden',
    NOT_FOUND = 'Not Found'
}

export const commentsService = {

    async createComment(postId: string, {_id, login}: UserType, content: string): Promise<ObjectId|null>{
        const isExistingPost = await postsQueryRepository.findPost(formatIdInObjectId(postId))
        if(!isExistingPost) return null
        const newComment: CommentType ={
            _id: new ObjectId(),
            content: content,
            commentatorInfo: {
                userId: _id.toString(),
                userLogin: login,
            },
            createdAt: new Date().toISOString()
        }

        return commentsRepository.createComment(newComment)

    },
    async updateComment(commentId: string, content: string, userId: ObjectId): Promise<ResponseOptions> {

        const foundComment = await queryCommentsRepository.findComment(formatIdInObjectId(commentId))

        if(!foundComment) return ResponseOptions.NOT_FOUND

        if(foundComment.commentatorInfo.userId !== userId.toString()) return ResponseOptions.FORBIDDEN

        await commentsRepository.updateComment(formatIdInObjectId(commentId), content)

        return ResponseOptions.NO_CONTENT
    },

    async deleteComment (commentId: string, userId: ObjectId): Promise<ResponseOptions>{
        const foundComment = await queryCommentsRepository.findComment(formatIdInObjectId(commentId))

        if(!foundComment) return ResponseOptions.NOT_FOUND

        if(foundComment.commentatorInfo.userId !== userId.toString()) return ResponseOptions.FORBIDDEN

        await commentsRepository.deleteComment(formatIdInObjectId(commentId))

        return ResponseOptions.NO_CONTENT
    }
}