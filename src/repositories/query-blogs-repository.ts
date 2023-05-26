import {BlogViewModel} from "../models/blog-models/BlogViewModel";
import {collectionBlogs, collectionPosts} from "../db/db";
import {ObjectId, Sort} from "mongodb";
import {BlogType} from "../db/db-blogs-type";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {QueryInputModel} from "../models/QueryInputModel";
import {limitPages} from "../helpers/limitPages";
import {pageCount} from "../helpers/pageCount";
import {mapPost} from "./query-posts-repository";
import {QueryViewModel} from "../models/QueryViewModel";

export const blogsQueryRepository = {

    async allBlogs(query: QueryInputModel): Promise<QueryViewModel<BlogViewModel>> {
        const {searchNameTerm = null, sortBy = 'createdAt', sortDirection='desc', pageNumber = 1, pageSize = 10} = query

        const totalCount = await collectionBlogs.countDocuments({name: {$regex: `${searchNameTerm ? searchNameTerm : ''}`, $options: 'i'}})

        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: await collectionBlogs.find({name: {$regex: `${searchNameTerm ? searchNameTerm : ''}`, $options: 'i'}})
                .sort({[sortBy]: sortDirection === 'asc'? 1: -1} as Sort)
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

    async allPostsForBlog(id: string, blogQuery: QueryInputModel): Promise<QueryViewModel<PostViewModel>|null>{
        const {sortBy = 'createdAt', sortDirection='desc', pageNumber = 1, pageSize = 10} = blogQuery

        const foundPosts: PostViewModel[] = await collectionPosts.find({blogId: id})
            .sort({[sortBy]: sortDirection === 'asc'? 1: -1} as Sort)
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