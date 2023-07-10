import {ObjectId} from "mongodb";
import {PostsQueryRepository} from "../repositories/query-posts-repository";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {UserType} from "../db/db-users-type";
import {CommentType} from "../db/db-comments-type";
import {CommentsRepository} from "../repositories/comments-repository";
import {QueryCommentsRepository} from "../repositories/query-comments-repository";
import {RESPONSE_OPTIONS} from "../types/res-status";


export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository,
                protected queryCommentsRepository: QueryCommentsRepository,
                protected postsQueryRepository: PostsQueryRepository) {

    }


    async createComment(postId: string, {_id, login}: UserType, content: string): Promise<ObjectId | null> {
        const isExistingPost = await this.postsQueryRepository.findPost(new ObjectId(postId))
        if (!isExistingPost) return null
        const newComment: CommentType = new CommentType(
            new ObjectId(),
            content,
            {
                userId: _id.toString(),
                userLogin: login,
            },
            new Date().toISOString(),
            isExistingPost.id
        )

        return this.commentsRepository.createComment(newComment)

    }

    async updateComment(commentId: string, content: string, userId: ObjectId): Promise<RESPONSE_OPTIONS> {

        const foundComment = await this.queryCommentsRepository.findComment(new ObjectId(commentId))

        if (!foundComment) return RESPONSE_OPTIONS.NOT_FOUND

        if (foundComment.commentatorInfo.userId !== userId.toString()) return RESPONSE_OPTIONS.FORBIDDEN

        await this.commentsRepository.updateComment(new ObjectId(commentId), content)

        return RESPONSE_OPTIONS.NO_CONTENT
    }

    async deleteComment(commentId: string, userId: ObjectId): Promise<RESPONSE_OPTIONS> {
        const foundComment = await this.queryCommentsRepository.findComment(formatIdInObjectId(commentId))

        if (!foundComment) return RESPONSE_OPTIONS.NOT_FOUND

        if (foundComment.commentatorInfo.userId !== userId.toString()) return RESPONSE_OPTIONS.FORBIDDEN

        await this.commentsRepository.deleteComment(formatIdInObjectId(commentId))

        return RESPONSE_OPTIONS.NO_CONTENT
    }
}

