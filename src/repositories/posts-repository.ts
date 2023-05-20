import {PostType} from "../db/db-posts-type";
import {collectionPosts} from "../db/db";
import {BSON, ObjectId} from "mongodb";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";


export const postsRepository = {

    async createPost(createPost: any): Promise<ObjectId>{
        await collectionPosts.insertOne(createPost)
        return createPost._id

    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, createdAt: string|undefined): Promise<boolean>{
        const result = await collectionPosts.updateOne({_id: formatIdInObjectId(id)}, createdAt? {$set: {title, shortDescription, content, createdAt}}: {$set: {title, shortDescription, content}})
        return result.matchedCount === 1

    },
    async deletePost(id: string): Promise<boolean> {
        const result = await collectionPosts.deleteOne({_id: formatIdInObjectId(id)})
        return result.deletedCount === 1
    }

}