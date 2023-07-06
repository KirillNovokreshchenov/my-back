import {PostType} from "../db/db-posts-type";
import {collectionPosts} from "../db/db";
import {BSON, ObjectId} from "mongodb";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {PostModelClass} from "../db/schemas/schema-post";


export const postsRepository = {

    async createPost(createPost: PostType): Promise<ObjectId>{
        await PostModelClass.create(createPost)
        return createPost._id

    },

    async updatePost(postId: ObjectId, title: string, shortDescription: string, content: string, blogId: string, blogName: string): Promise<boolean>{
        const result = await PostModelClass.updateOne({_id: postId}, {$set: {title, shortDescription, content, blogId, blogName}})
        return result.modifiedCount === 1

    },
    async deletePost(id: string): Promise<boolean> {
        const result = await PostModelClass.deleteOne({_id: formatIdInObjectId(id)})
        return result.deletedCount === 1
    }

}