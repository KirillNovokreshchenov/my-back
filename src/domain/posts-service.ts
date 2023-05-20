import {PostType} from "../db/db-posts-type";
import {findBlogName} from "../helpers/post-helpers/findBlogName";
import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";
import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";


export const postsService = {

    async createPost({title, shortDescription, content, blogId, createdAt}: CreateAndUpdatePostModel): Promise<ObjectId>{
        const createPost= {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: await findBlogName(blogId),
            createdAt: createdAt || new Date().toISOString(),
            isMembership: false
        }

        return await postsRepository.createPost(createPost)


    },

    async updatePost(id: string, {title, shortDescription, content, createdAt}: CreateAndUpdatePostModel): Promise<boolean>{
        return await postsRepository.updatePost(id, title, shortDescription, content, createdAt)

    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    }

}