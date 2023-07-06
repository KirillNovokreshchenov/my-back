
import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";
import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";
import {collectionBlogs} from "../db/db";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {PostType} from "../db/db-posts-type";
import {blogsQueryRepository} from "../repositories/query-blogs-repository";
import {BlogType} from "../db/db-blogs-type";
import {BlogViewModel} from "../models/blog-models/BlogViewModel";


export const postsService = {

    async createPost({title, shortDescription, content, blogId}: CreateAndUpdatePostModel): Promise<ObjectId|null>{

        const foundBlogName = await blogsQueryRepository.findBlog(new ObjectId(blogId))
        if(!foundBlogName){
            return null
        }

        const createPost: PostType = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlogName.name,
            createdAt: new Date().toISOString(),
        }

        return await postsRepository.createPost(createPost)


    },

    async updatePost(postId: string, {title, shortDescription, content, blogId}: CreateAndUpdatePostModel): Promise<boolean>{
        const blog:BlogViewModel|null = await blogsQueryRepository.findBlog(new ObjectId(blogId))
        if(!blog) return false
        return await postsRepository.updatePost(new ObjectId(postId), title, shortDescription, content, blogId, blog.name)

    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    }

}