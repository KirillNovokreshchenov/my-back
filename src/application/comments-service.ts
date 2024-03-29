import {ObjectId} from "mongodb";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {UserType} from "../db/db-users-type";
import {CommentType, LikeStatus} from "../db/db-comments-type";
import {CommentsRepository} from "../infrastructure/repositories/comments-repository";
import {RESPONSE_OPTIONS} from "../types/res-status";
import {LIKE_STATUS} from "../models/comment-models/EnumLikeStatusModel";
import {PostsRepository} from "../infrastructure/repositories/posts-repository";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {

    constructor( @inject(CommentsRepository)protected commentsRepository: CommentsRepository,
                 @inject(PostsRepository)protected postsRepository: PostsRepository ) {

    }


    async createComment(postId: string, {_id, login}: UserType, content: string): Promise<ObjectId | null> {
        const isExistingPost = await this.postsRepository.findPost(new ObjectId(postId))
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

        const foundComment = await this.commentsRepository.findComment(new ObjectId(commentId))

        if (!foundComment) return RESPONSE_OPTIONS.NOT_FOUND

        if (foundComment.commentatorInfo.userId !== userId.toString()) return RESPONSE_OPTIONS.FORBIDDEN

        await this.commentsRepository.updateComment(new ObjectId(commentId), content)

        return RESPONSE_OPTIONS.NO_CONTENT
    }

    async deleteComment(commentId: string, userId: ObjectId): Promise<RESPONSE_OPTIONS> {
        const foundComment = await this.commentsRepository.findComment(formatIdInObjectId(commentId))

        if (!foundComment) return RESPONSE_OPTIONS.NOT_FOUND

        if (foundComment.commentatorInfo.userId !== userId.toString()) return RESPONSE_OPTIONS.FORBIDDEN

        await this.commentsRepository.deleteComment(formatIdInObjectId(commentId))

        return RESPONSE_OPTIONS.NO_CONTENT
    }

   async updateLikeStatus(commentId: string, likeStatus: LIKE_STATUS, userId: ObjectId): Promise<boolean> {

       const commentIsExist =  await this.commentsRepository.findComment(new ObjectId(commentId))
       if(!commentIsExist) return false

       const likeStatusIsExist = await this.commentsRepository.getLikeStatus(new ObjectId(commentId), userId)
       if(!likeStatusIsExist) {
           const newLikeStatus = new LikeStatus(new ObjectId(), new ObjectId(commentId), userId, likeStatus)
           await this.commentsRepository.createLikeStatus(newLikeStatus, likeStatus, new ObjectId(commentId))
           return true
       }

       if(likeStatus === LIKE_STATUS.NONE){
           await this.commentsRepository.deleteLikeStatus(new ObjectId(commentId), userId, likeStatusIsExist.likeStatus)
           return true
       }

       if(likeStatus!==likeStatusIsExist.likeStatus){
           await this.commentsRepository.updateLikeStatus(new ObjectId(commentId), userId, likeStatus)
           return true
       }
       return true

   }

}

