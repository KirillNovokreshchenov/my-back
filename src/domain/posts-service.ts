import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";
import {PostsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";
import {PostType} from "../db/db-posts-type";
import {QueryBlogsRepository} from "../repositories/query-blogs-repository";

import {BlogViewModel} from "../models/blog-models/BlogViewModel";


export class PostsService {

    constructor(private postsRepository: PostsRepository,
                private blogsQueryRepository: QueryBlogsRepository) {

    }

    async createPost({title, shortDescription, content, blogId}: CreateAndUpdatePostModel): Promise<ObjectId | null> {

        const foundBlogName = await this.blogsQueryRepository.findBlog(new ObjectId(blogId))
        if (!foundBlogName) {
            return null
        }

        const createPost: PostType = new PostType(
            new ObjectId(),
            title,
            shortDescription,
            content,
            blogId,
            foundBlogName.name,
            new Date().toISOString(),
        )

        return await this.postsRepository.createPost(createPost)


    }

    async updatePost(postId: string, {
        title,
        shortDescription,
        content,
        blogId
    }: CreateAndUpdatePostModel): Promise<boolean> {
        const blog: BlogViewModel | null = await this.blogsQueryRepository.findBlog(new ObjectId(blogId))
        if (!blog) return false
        return await this.postsRepository.updatePost(new ObjectId(postId), title, shortDescription, content, blogId, blog.name)

    }

    async deletePost(id: string): Promise<boolean> {
        return await this.postsRepository.deletePost(id)
    }

}

