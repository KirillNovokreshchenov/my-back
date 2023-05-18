import {PostType} from "../db/db-posts-type";
import {collectionPosts} from "../db/db";
import {BSON, ObjectId} from "mongodb";


export const postsRepository = {

    async createPost(createPost: any): Promise<ObjectId>{
        await collectionPosts.insertOne(createPost)
        return createPost._id

    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, optionalPropertiesIsValid:object): Promise<boolean>{
        const objId = new BSON.ObjectId(id)
        const result = await collectionPosts.updateOne({_id: objId}, {$set: {title, shortDescription, content, ...optionalPropertiesIsValid}})
        return result.matchedCount === 1

    },
    async deletePost(id: string): Promise<boolean> {
        const objId = new BSON.ObjectId(id)
        const result = await collectionPosts.deleteOne({_id: objId})
        return result.deletedCount === 1
    }

}