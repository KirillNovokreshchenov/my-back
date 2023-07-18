import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";
import {PostsRepository} from "../infrastructure/repositories/posts-repository";
import {ObjectId} from "mongodb";
import {PostType} from "../db/db-posts-type";
import {BlogsRepository} from "../infrastructure/repositories/blogs-repository";
import {BlogType} from "../db/db-blogs-type";
import {inject, injectable} from "inversify";

@injectable()
export class PostsService {

    constructor(@inject(PostsRepository)protected postsRepository: PostsRepository,
                @inject(BlogsRepository)protected blogsRepository: BlogsRepository
    ) {

    }

    async createPost({title, shortDescription, content, blogId}: CreateAndUpdatePostModel): Promise<ObjectId | null> {

        const foundBlogName = await this.blogsRepository.findBlog(new ObjectId(blogId))
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
        const blog: BlogType | null = await this.blogsRepository.findBlog(new ObjectId(blogId))
        if (!blog) return false
        return await this.postsRepository.updatePost(new ObjectId(postId), title, shortDescription, content, blogId, blog.name)

    }

    async deletePost(id: string): Promise<boolean> {
        return await this.postsRepository.deletePost(id)
    }

}

