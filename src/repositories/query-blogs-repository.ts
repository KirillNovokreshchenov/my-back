import {BlogViewModel} from "../models/blog-models/BlogViewModel";
import {collectionBlogs, collectionPosts} from "../db/db";
import {BSON, FindCursor, ObjectId} from "mongodb";
import {BlogType} from "../db/db-blogs-type";
import {PostType} from "../db/db-posts-type";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {QueryModel} from "../models/QueryModel";
import {limitPages} from "../helpers/limitPages";
import {BlogQueryViewModel} from "../models/blog-models/BlogQueryViewModel";
import {pageCount} from "../helpers/pageCount";
import {PostQueryViewModel} from "../models/post-models/PostQueryViewModel";
import {mapPost} from "./query-posts-repository";

export const blogsQueryRepository = {

    async allBlogs({searchNameTerm = null, sortBy = 'createdAt', sortDirection='desc', pageNumber = 1, pageSize = 10}: QueryModel): Promise<BlogQueryViewModel> {

        const totalCount = await collectionBlogs.countDocuments({name: {$regex: `${searchNameTerm ? searchNameTerm : ''}`, $options: 'i'}})

        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: await collectionBlogs.find({name: {$regex: `${searchNameTerm ? searchNameTerm : ''}`, $options: 'i'}})
                .sort({[sortBy]: sortDirection === 'asc'? 1: -1})
                .skip(limitPages(+pageNumber, +pageSize))
                .limit(+pageSize)
                .map(blog=>{
                    return mapBlog(blog)
                }).toArray()
        }
    },

    async findBlog(id: ObjectId): Promise<BlogViewModel | null> {

        const foundBlog: BlogType|null = await collectionBlogs.findOne(id)
        if (!foundBlog) {
            return null
        }

        return mapBlog(foundBlog)

    },

    async allPostsForBlog(id: string, {sortBy = 'createdAt', sortDirection='desc', pageNumber = 1, pageSize = 10}: QueryModel): Promise<PostQueryViewModel|null>{

        const foundPosts: PostViewModel[] = await collectionPosts.find({blogId: id})
            .sort({[sortBy]: sortDirection === 'asc'? 1: -1})
            .skip(limitPages(+pageNumber, +pageSize))
            .limit(+pageSize)
            .map(post=>{
                return mapPost(post)
            }).toArray()

        if(foundPosts.length===0) return null

        const totalCount = await collectionPosts.countDocuments({blogId: id})
        return {
                pagesCount: pageCount(totalCount, +pageSize),
                page: +pageNumber,
                pageSize:+pageSize,
                totalCount: totalCount,
                items: foundPosts
        }

    }

}

function mapBlog(blog: BlogType){
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,

    }
}