import {collectionBlogs, collectionPosts} from "../db/db";
import {BSON, ObjectId} from "mongodb";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";


export const blogsRepository = {

    async createBlog(newBlog: any): Promise<ObjectId>{
        await collectionBlogs.insertOne(newBlog)
        return newBlog._id
    },

    async createPostForBlog(newPost:any): Promise<ObjectId>{
        await collectionPosts.insertOne(newPost)
        return newPost._id
    },

    async  updateBlog(id: string, name: string, description: string, websiteUrl: string, createdAt: string|undefined): Promise<boolean>{
        const result = await collectionBlogs.updateOne({_id:formatIdInObjectId(id)}, createdAt? {$set: {name, description, websiteUrl, createdAt}}: {$set: {name, description, websiteUrl}})

        await collectionPosts.updateMany({blogId: id}, {$set:{blogName: name}})

        return result.matchedCount === 1
    },



    async  deleteBlog(id: string) : Promise<boolean> {
        const result = await collectionBlogs.deleteOne({_id: formatIdInObjectId(id)})
        return result.deletedCount === 1
    }
}