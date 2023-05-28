import {ObjectId, Sort} from "mongodb";
import {collectionComments, collectionPosts} from "../db/db";
import {CommentType} from "../db/db-comments-type";
import {CommentViewModel} from "../models/comment-models/CommentViewModel";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {CommentsQueryInputModel} from "../models/comment-models/CommentsQueryInputModel";
import {QueryViewModel} from "../models/QueryViewModel";
import {pageCount} from "../helpers/pageCount";
import {limitPages} from "../helpers/limitPages";

export const queryCommentsRepository = {
    async findComment(id: ObjectId): Promise<CommentViewModel|null> {
        const comment = await collectionComments.findOne(id)
        if(!comment) return null
        return this._mapComment(comment)
    },

    async getComments(id: string, query: CommentsQueryInputModel): Promise<QueryViewModel<CommentViewModel> | null> {
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query
        const post = await collectionPosts.findOne(formatIdInObjectId(id))

        if (!post) return null

        const totalCount = await collectionComments.countDocuments()
        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize:+pageSize,
            totalCount: totalCount,
            items: await collectionComments.find({})
                .sort({[sortBy]: sortDirection === 'asc'? 1: -1} as Sort)
                .skip(limitPages(+pageNumber, +pageSize))
                .limit(+pageSize)
                .map(comment=>{
                    return this._mapComment(comment)
                }).toArray()
        }
    },


    _mapComment(comment: CommentType): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt
        }
    }
}