import {PostType} from "../db/db-posts-type";
import {collectionPosts} from "../db/db";
import {BSON, ObjectId} from "mongodb";
import {PostViewModel} from "../models/post-models/PostViewModel";


export const postsQueryRepository = {
    async allPosts(): Promise<PostViewModel[]> {
        const foundPosts: PostType[] = await collectionPosts.find({}).toArray();
        return foundPosts.map(post => {
            const objId = new BSON.ObjectId(post._id)
            return {
                id: objId.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
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