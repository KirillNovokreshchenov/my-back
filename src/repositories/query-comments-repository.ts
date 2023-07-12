import {ObjectId} from "mongodb";
import {collectionPosts} from "../db/db";
import {CommentType, LikeStatus} from "../db/db-comments-type";
import {CommentViewModel} from "../models/comment-models/CommentViewModel";
import {CommentsQueryInputModel} from "../models/comment-models/CommentsQueryInputModel";
import {QueryViewModel} from "../models/QueryViewModel";
import {pageCount} from "../helpers/pageCount";
import {limitPages} from "../helpers/limitPages";
import {CommentModelClass, LikeStatusClass} from "../db/schemas/schema-comment";
import {LIKE_STATUS} from "../models/comment-models/EnumLikeStatusModel";


export class QueryCommentsRepository {
    async findComment(commentId: ObjectId, userId?: ObjectId): Promise<CommentViewModel | null> {
        const comment: CommentType | null = await CommentModelClass.findOne({_id: commentId})
        if (!comment) return null
        return this._mapComment(comment, userId)
    }

    async getComments(postId: string, query: CommentsQueryInputModel, userId?: ObjectId): Promise<QueryViewModel<CommentViewModel> | null> {
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query

        const post = await collectionPosts.findOne(new ObjectId(postId))

        if (!post) return null

        const totalCount = await CommentModelClass.countDocuments({postId: postId})

        const comments: CommentType[] = await CommentModelClass.find({postId: postId})
            .sort(sortDirection === 'asc' ? `${sortBy}` : `-${sortBy}`)
            .skip(limitPages(+pageNumber, +pageSize))
            .limit(+pageSize)
            .lean()

        const items: CommentViewModel[] = await Promise.all(comments.map(comment => this._mapComment(comment, userId)))

        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items
        }
    }


    async _mapComment(comment: CommentType, userId?: ObjectId): Promise<CommentViewModel> {
        let likeStatus: LIKE_STATUS = LIKE_STATUS.NONE
        const existingLike: LikeStatus|null = await LikeStatusClass.findOne({$and: [{commentId: comment._id}, {userId: userId}]}).lean()
        if (existingLike) {
            likeStatus = existingLike.likeStatus
        }

        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likes,
                dislikesCount: comment.likesInfo.dislikes,
                myStatus: likeStatus
            }

        }
    }

}

