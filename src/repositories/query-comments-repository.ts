import {ObjectId, Sort} from "mongodb";
import {collectionComments, collectionPosts} from "../db/db";
import {CommentType} from "../db/db-comments-type";
import {CommentViewModel} from "../models/comment-models/CommentViewModel";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {CommentsQueryInputModel} from "../models/comment-models/CommentsQueryInputModel";
import {QueryViewModel} from "../models/QueryViewModel";
import {pageCount} from "../helpers/pageCount";
import {limitPages} from "../helpers/limitPages";
import {CommentModelClass} from "../db/schemas/schema-comment";
import {PostModelClass} from "../db/schemas/schema-post";
import {PostType} from "../db/db-posts-type";
import {FlattenMaps} from "mongoose";


class QueryCommentsRepository {
    async findComment(id: ObjectId): Promise<CommentViewModel|null> {
        const comment:CommentType|null= await CommentModelClass.findOne({ _id: id })
       if(!comment) return null
        return this._mapComment(comment)
    }

    async getComments(id: string, query: CommentsQueryInputModel): Promise<QueryViewModel<CommentViewModel> | null> {
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query

        const post = await collectionPosts.findOne(new ObjectId(id))

        if (!post) return null

        const totalCount = await CommentModelClass.countDocuments({postId: id})

        const items = await CommentModelClass.find({postId: id})
            .sort(sortDirection ==='asc'? `${sortBy}`: `-${sortBy}`)
            .skip(limitPages(+pageNumber, +pageSize))
            .limit(+pageSize)
            .lean()
            .then((comments)=>{
                return Array.from(comments).map((comment:CommentType) => this._mapComment(comment))
            })

        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize:+pageSize,
            totalCount: totalCount,
            items: items
        }
    }


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

export const queryCommentsRepository = new QueryCommentsRepository()