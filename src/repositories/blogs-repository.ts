import {collectionBlogs, collectionPosts} from "../db/db";
import {BSON, ObjectId} from "mongodb";


export const blogsRepository = {

    async createBlog(newBlog: any): Promise<ObjectId>{
        await collectionBlogs.insertOne(newBlog)
        return newBlog._id
    },

    async createPostForBlog(newPost:any): Promise<ObjectId>{
        await collectionPosts.insertOne(newPost)
        return newPost._id
    },

    async  updateBlog(id: string, name: string, description: string, websiteUrl: string, optionalPropertiesIsValid: object): Promise<boolean>{
        const objId = new BSON.ObjectId(id)
        const result = await collectionBlogs.updateOne({_id:objId}, {$set: {name, description, websiteUrl, ...optionalPropertiesIsValid}})

        await collectionPosts.updateMany({blogId: id}, {$set:{blogName: name}})

        return result.matchedCount === 1
    },



    async  deleteBlog(id: string) : Promise<boolean> {
        const objId = new BSON.ObjectId(id)
        const result = await collectionBlogs.deleteOne({_id: objId})

        return result.deletedCount === 1
    }
}