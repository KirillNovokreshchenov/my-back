import {PostType} from "../db/db-posts-type";
import {collectionPosts} from "../db/db";
import {ObjectId, Sort} from "mongodb";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {pageCount} from "../helpers/pageCount";
import {limitPages} from "../helpers/limitPages";
import {QueryInputModel} from "../models/QueryInputModel";
import {QueryViewModel} from "../models/QueryViewModel";


export const postsQueryRepository = {
    async allPosts(query: QueryInputModel): Promise<QueryViewModel<PostViewModel>> {
        const {sortBy = 'createdAt', sortDirection='desc', pageNumber = 1, pageSize = 10} = query
        const totalCount = await collectionPosts.countDocuments()
        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize:+pageSize,
            totalCount: totalCount,
            items: await collectionPosts.find({})
                .sort({[sortBy]: sortDirection === 'asc'? 1: -1} as Sort)
                .skip(limitPages(+pageNumber, +pageSize))
                .limit(+pageSize)
                .map(post=>{
                    return mapPost(post)
                }).toArray()
        }

    },
    async findPost(id: ObjectId): Promise<PostViewModel | null> {
        const foundPost: PostType | null = await collectionPosts.findOne(id)
        if (!foundPost) return null
        return mapPost(foundPost)

    },
}
export function mapPost(post: PostType){
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