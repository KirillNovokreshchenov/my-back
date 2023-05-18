import {BlogViewModel} from "../models/blog-models/BlogViewModel";
import {collectionBlogs, collectionPosts} from "../db/db";
import {BSON, ObjectId} from "mongodb";
import {BlogType} from "../db/db-blogs-type";
import {PostType} from "../db/db-posts-type";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {QueryModel} from "../models/QueryModel";

export const blogsQueryRepository = {
    async allBlogs({searchNameTerm = null, sortBy = 'createdAt', sortDirection='desc', pageNumber = 1, pageSize = 10}: QueryModel): Promise<BlogViewModel[]> {

        const foundBlogs: BlogType[] = await collectionBlogs.find({name: {$regex: `${searchNameTerm ? searchNameTerm : ''}`, $options: 'i'}})
            .toArray()
        return foundBlogs.map(blog => {
            const objId = new BSON.ObjectId(blog._id)
            return {
                id: objId.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
            }
        })
    },

    async findBlog(id: string | ObjectId): Promise<BlogViewModel | null> {
        const objId = new BSON.ObjectId(id)
        const foundBlog: BlogType|null = await collectionBlogs.findOne(objId)
        if (!foundBlog) {
            return null
        }

        return {
            id: objId.toString(),
            name: foundBlog.name,
            description: foundBlog.description,
            websiteUrl: foundBlog.websiteUrl,
            createdAt: foundBlog.createdAt,
            isMembership: foundBlog.isMembership,
        }

    },

    async allPostsForBlog(id: string): Promise<PostViewModel[]|null>{
        const foundPosts: PostType[] = await collectionPosts.find({blogId: id}).toArray();
        if(foundPosts.length===0) return null
        return foundPosts.map(post => {
            const objId = new BSON.ObjectId(post._id)
            return {
                id: objId.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            }

        })

    }
}