import {BlogsRepository} from "../repositories/blogs-repository";
import {CreateAndUpdateBlogInputModel} from "../models/blog-models/CreateAndUpdateBlogInputModel";
import {ObjectId} from "mongodb";
import {CreateModelPostForBlog} from "../models/blog-models/CreateModelPostForBlog";
import {BlogType} from "../db/db-blogs-type";
import {QueryBlogsRepository} from "../repositories/query-blogs-repository";
import {PostType} from "../db/db-posts-type";

export class BlogsService {

    constructor(protected blogsQueryRepository: QueryBlogsRepository,
                protected blogsRepository: BlogsRepository) {
    }

    async createBlog({name, description, websiteUrl}: CreateAndUpdateBlogInputModel): Promise<ObjectId> {

        const newBlog: BlogType = new BlogType(
            new ObjectId(),
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false
        )
        return await this.blogsRepository.createBlog(newBlog)

    }

    async createPostForBlog(BlogId: string, {
        title,
        shortDescription,
        content
    }: CreateModelPostForBlog): Promise<ObjectId | null> {

        const foundBlogName = await this.blogsQueryRepository.findBlog(new ObjectId(BlogId))
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
        return this.blogsRepository.createPostForBlog(newPost)

    }

    async updateBlog(id: string, {name, description, websiteUrl}: CreateAndUpdateBlogInputModel): Promise<boolean> {
        return await this.blogsRepository.updateBlog(id, name, description, websiteUrl)
    }

    async deleteBlog(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlog(id)

    }
}

