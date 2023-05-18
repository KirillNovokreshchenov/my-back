import {blogsRepository} from "../repositories/blogs-repository";
import {CreateAndUpdateBlogInputModel} from "../models/blog-models/CreateAndUpdateBlogInputModel";
import {filterProperties} from "../helpers/blog-helpers/filterProperties";
import {ObjectId} from "mongodb";
import {CreateModelPostForBlog} from "../models/blog-models/CreateModelPostForBlog";
import {findBlogName} from "../helpers/post-helpers/findBlogName";
import {postsRepository} from "../repositories/posts-repository";



export const blogsService = {

    async createBlog({name, description, websiteUrl, createdAt}: CreateAndUpdateBlogInputModel): Promise<ObjectId>{
        const newBlog = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: createdAt || new Date().toISOString(),
            isMembership: false
        }
         return await blogsRepository.createBlog(newBlog)


    },
    async createPostForBlog(id:string, {title, shortDescription, content, createdAt}: CreateModelPostForBlog): Promise<ObjectId>{
        const newPost = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: id,
            blogName: await findBlogName(id),
            createdAt: createdAt || new Date().toISOString(),
            isMembership: false
        }
        return await blogsRepository.createPostForBlog(newPost)

    },

    async  updateBlog(id: string,{name, description, websiteUrl, ...optionalProperties}: CreateAndUpdateBlogInputModel): Promise<boolean>{
        const optionalPropertiesIsValid = filterProperties(optionalProperties)
        return await blogsRepository.updateBlog(id, name, description, websiteUrl, optionalPropertiesIsValid)
    },

    async  deleteBlog(id: string) : Promise<boolean> {
        return  await blogsRepository.deleteBlog(id)


    }
}