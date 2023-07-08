import {collectionBlogs, collectionPosts} from "../db/db";
import {BSON, ObjectId} from "mongodb";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {BlogType} from "../db/db-blogs-type";
import {BlogModelClass} from "../db/schemas/schema-blog";
import {PostModelClass} from "../db/schemas/schema-post";


class BlogsRepository {
    async createBlog(newBlog: BlogType): Promise<ObjectId> {
        await BlogModelClass.create(newBlog)
        return newBlog._id
    }

    async createPostForBlog(newPost: any): Promise<ObjectId> {
        await PostModelClass.create(newPost)
        return newPost._id
    }

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await BlogModelClass.updateOne({_id: formatIdInObjectId(id)}, {
            $set: {
                name,
                description,
                websiteUrl
            }
        })

        await PostModelClass.updateMany({blogId: id}, {$set: {blogName: name}})

        return result.modifiedCount === 1
    }

    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModelClass.deleteOne({_id: formatIdInObjectId(id)})
        return result.deletedCount === 1
    }

}

export const blogsRepository = new BlogsRepository()