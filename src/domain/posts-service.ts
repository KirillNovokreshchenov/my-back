
import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";
import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";
import {collectionBlogs} from "../db/db";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {PostType} from "../db/db-posts-type";


export const postsService = {

    async createPost({title, shortDescription, content, blogId, createdAt}: CreateAndUpdatePostModel): Promise<ObjectId>{

        const foundBlogName = await collectionBlogs.findOne({_id: formatIdInObjectId(blogId)})

        const createPost: PostType = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlogName!.name,
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