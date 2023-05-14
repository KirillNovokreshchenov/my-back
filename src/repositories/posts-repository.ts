import {PostType} from "../db/db-posts-type";
import {findBlogName} from "../helpers/post-helpers/findBlogName";
import {collectionBlogs, collectionPosts} from "../db/db";
import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";


export const postsRepository = {
    async allPosts(): Promise<Array<PostType>>{
        return collectionPosts.find({}, {projection: { _id: 0, isMembership: 0}}).toArray()
    },
    async createPost({title, shortDescription, content, blogId, createdAt}: CreateAndUpdatePostModel): Promise<PostType>{
        const createPost: PostType = {
            id: `${+new Date()}`,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: await findBlogName(blogId),
            createdAt: createdAt || new Date().toISOString(),
            isMembership: false
        }
        await collectionPosts.insertOne(createPost)
        const foundNewCreatedPost = await collectionPosts.findOne({id: createPost.id}, {projection: { _id: 0, isMembership: 0}})
        return foundNewCreatedPost!

    },
    async findPost(id: string): Promise<PostType|null>{
        return collectionPosts.findOne({id: id}, {projection: { _id: 0, isMembership: 0}})
    },
    async updatePost(id: string, {title, shortDescription, content, createdAt}: CreateAndUpdatePostModel): Promise<boolean>{
        let foundPost: PostType|null = await collectionPosts.findOne({id: id})
        const result =  createdAt ?
            await collectionPosts.updateOne({id}, {$set: {title, shortDescription, content, createdAt}})
            :await collectionPosts.updateOne({id}, {$set: {title, shortDescription, content}})

        return result.matchedCount === 1

    },
    async deletePost(id: string): Promise<boolean> {
        const result = await collectionPosts.deleteOne({id: id})
        return result.deletedCount === 1
    }

}