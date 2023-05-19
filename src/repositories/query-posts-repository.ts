import {PostType} from "../db/db-posts-type";
import {collectionBlogs, collectionPosts} from "../db/db";
import {BSON, ObjectId} from "mongodb";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {PostQueryViewModel} from "../models/post-models/PostQueryViewModel";
import {pageCount} from "../helpers/pageCount";
import {limitPages} from "../helpers/limitPages";
import {QueryModel} from "../models/QueryModel";


export const postsQueryRepository = {
    async allPosts({sortBy = 'createdAt', sortDirection='desc', pageNumber = 1, pageSize = 10}: QueryModel): Promise<PostQueryViewModel[]> {
        const foundPosts: PostType[] = await collectionPosts.find({})
            .sort({[sortBy]: sortDirection === 'asc'? 1: -1})
            .skip(limitPages(+pageNumber, +pageSize))
            .limit(+pageSize)
            .toArray();
        const totalCount = await collectionPosts.countDocuments()
        return foundPosts.map(post => {
            const objId = new BSON.ObjectId(post._id)
            return {
                pagesCount: pageCount(totalCount, +pageSize),
                page: +pageNumber,
                pageSize:+pageSize,
                totalCount: totalCount,
                items: [
                    {
                        id: objId.toString(),
                        title: post.title,
                        shortDescription: post.shortDescription,
                        content: post.content,
                        blogId: post.blogId,
                        blogName: post.blogName,
                        createdAt: post.createdAt
                    }
                ]

            }
        })
    },
    async findPost(id: string | ObjectId): Promise<PostViewModel | null> {
        const objId = new BSON.ObjectId(id)
        const foundPost: PostType | null = await collectionPosts.findOne(objId)
        if (!foundPost) return null
        return {
            id: objId.toString(),
            title: foundPost.title,
            shortDescription: foundPost.shortDescription,
            content: foundPost.content,
            blogId: foundPost.blogId,
            blogName: foundPost.blogName,
            createdAt: foundPost.createdAt,
        }

    },
}