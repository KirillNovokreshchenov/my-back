import {PostType} from "../../../db/db-posts-type";

import {ObjectId} from "mongodb";
import {NewestLikes, PostViewModel} from "../../../models/post-models/PostViewModel";
import {pageCount} from "../../../helpers/pageCount";
import {limitPages} from "../../../helpers/limitPages";
import {QueryInputModel} from "../../../models/QueryInputModel";
import {QueryViewModel} from "../../../models/QueryViewModel";
import {HydratedPost, PostModelClass} from "../../../domain/schema-post";
import {injectable} from "inversify";
import {LIKE_STATUS} from "../../../models/comment-models/EnumLikeStatusModel";
import {CommentViewModel} from "../../../models/comment-models/CommentViewModel";


@injectable()
export class PostsQueryRepository {
    async allPosts(query: QueryInputModel, userId?: ObjectId, blogId?: string): Promise<QueryViewModel<PostViewModel>> {

        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query

        const filter = blogId ? {blogId} : {}

        const totalCount = await PostModelClass.countDocuments(filter).exec()

        const posts: PostType[]= await PostModelClass.find(filter)
            .sort(sortDirection === 'asc' ? `${sortBy}` : `-${sortBy}`)
            .skip(limitPages(+pageNumber, +pageSize))
            .limit(+pageSize)
            .lean()
            .exec()

        const items: PostViewModel[] = posts.map(post => this._mapPost(post, userId))

        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items
        }

    }

    async findPost(postId: ObjectId, userId?: ObjectId): Promise<PostViewModel | null> {
        const foundPost: PostType | null = await PostModelClass.findOne(postId).lean().exec()
        if (!foundPost) return null
        return this._mapPost(foundPost, userId)

    }

    _mapPost(post: PostType, userId?: ObjectId): PostViewModel {
        let likeStatus = LIKE_STATUS.NONE
        if (userId) {
            const userLike = post.likesInfo.usersLikes.find(userLike => userLike.userId.toString() === userId.toString())
            if (userLike) likeStatus = userLike.likeStatus
        }
       const newestLikes: NewestLikes[] = post.likesInfo.usersLikes.filter(likes=>likes.likeStatus===LIKE_STATUS.LIKE).slice(-3).map(like=>{
           return {
               addedAt: like.addedAt,
               login: like.userLogin,
               userId: like.userId.toString()

           }
       })

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.likesInfo.likes,
                dislikesCount: post.likesInfo.dislikes,
                myStatus: likeStatus,
                newestLikes:newestLikes
            }
        }
    }


}


