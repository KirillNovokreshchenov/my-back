import {PostType} from "../db/db-posts-type";
import {collectionPosts} from "../db/db";
import {ObjectId, Sort} from "mongodb";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {pageCount} from "../helpers/pageCount";
import {limitPages} from "../helpers/limitPages";
import {QueryInputModel} from "../models/QueryInputModel";
import {QueryViewModel} from "../models/QueryViewModel";
import {PostModelClass} from "../db/schemas/schema-post";
import {BlogType} from "../db/db-blogs-type";


class PostsQueryRepository {
    async allPosts(query: QueryInputModel, blogId?: string): Promise<QueryViewModel<PostViewModel>> {

        const {sortBy = 'createdAt', sortDirection='desc', pageNumber = 1, pageSize = 10} = query

        const totalCount = await PostModelClass.countDocuments(blogId?{blogId}:{})

        const items = await PostModelClass.find(blogId?{blogId}:{})
            .sort(sortDirection ==='asc'? `${sortBy}`: `-${sortBy}`)
            .skip(limitPages(+pageNumber, +pageSize))
            .limit(+pageSize)
            .lean()
            .then((posts)=>{
                return Array.from(posts).map((post: PostType) => this._mapPost(post))
            })

        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize:+pageSize,
            totalCount: totalCount,
            items: items
        }

    }
    async findPost(id: ObjectId): Promise<PostViewModel | null> {
        const foundPost: PostType | null = await PostModelClass.findOne(id)
        if (!foundPost) return null
        return this._mapPost(foundPost)

    }

    _mapPost(post: PostType){
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }
    }
}

export const postsQueryRepository = new PostsQueryRepository()
