import {blogsRepository} from "../repositories/blogs-repository";
import {CreateAndUpdateBlogInputModel} from "../models/blog-models/CreateAndUpdateBlogInputModel";

import {ObjectId} from "mongodb";
import {CreateModelPostForBlog} from "../models/blog-models/CreateModelPostForBlog";
import {collectionBlogs} from "../db/db";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {BlogType} from "../db/db-blogs-type";




export const blogsService = {

    async createBlog({name, description, websiteUrl, createdAt}: CreateAndUpdateBlogInputModel): Promise<ObjectId>{

        const newBlog:BlogType = {
            _id:new ObjectId(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: createdAt || new Date().toISOString(),
            isMembership: false
        }

         return await blogsRepository.createBlog(newBlog)


    },
    async createPostForBlog(id:string, {title, shortDescription, content, createdAt}: CreateModelPostForBlog): Promise<ObjectId|null>{
        const foundBlogName = await collectionBlogs.findOne({_id: formatIdInObjectId(id)})
        if(!foundBlogName){
            return null
        }
        const newPost = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: id,
            blogName: foundBlogName.name,
            createdAt: createdAt || new Date().toISOString(),
            isMembership: false
        }
        return await blogsRepository.createPostForBlog(newPost)

    },

    async  updateBlog(id: string,{name, description, websiteUrl, createdAt}: CreateAndUpdateBlogInputModel): Promise<boolean>{
        return await blogsRepository.updateBlog(id, name, description, websiteUrl, createdAt)
    },

    async  deleteBlog(id: string) : Promise<boolean> {
        return  await blogsRepository.deleteBlog(id)


    }
}