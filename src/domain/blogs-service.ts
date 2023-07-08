import {blogsRepository} from "../repositories/blogs-repository";
import {CreateAndUpdateBlogInputModel} from "../models/blog-models/CreateAndUpdateBlogInputModel";

import {ObjectId} from "mongodb";
import {CreateModelPostForBlog} from "../models/blog-models/CreateModelPostForBlog";
import {collectionBlogs} from "../db/db";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {BlogType} from "../db/db-blogs-type";
import {blogsQueryRepository} from "../repositories/query-blogs-repository";
import {PostType} from "../db/db-posts-type";

class BlogsService {

    async createBlog({name, description, websiteUrl}: CreateAndUpdateBlogInputModel): Promise<ObjectId> {

        const newBlog: BlogType = new BlogType(
            new ObjectId(),
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false
        )

        return await blogsRepository.createBlog(newBlog)


    }

    async createPostForBlog(BlogId: string, {
        title,
        shortDescription,
        content
    }: CreateModelPostForBlog): Promise<ObjectId | null> {

        const foundBlogName = await blogsQueryRepository.findBlog(new ObjectId(BlogId))
        if (!foundBlogName) {
            return null
        }
        const newPost = new PostType(
            new ObjectId(),
            title,
            shortDescription,
            content,
            BlogId,
            foundBlogName.name,
            new Date().toISOString(),
        )
        return blogsRepository.createPostForBlog(newPost)

    }

    async updateBlog(id: string, {name, description, websiteUrl}: CreateAndUpdateBlogInputModel): Promise<boolean> {
        return await blogsRepository.updateBlog(id, name, description, websiteUrl)
    }

    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)


    }
}

export const blogsService = new BlogsService()