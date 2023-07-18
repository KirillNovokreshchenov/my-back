import {BlogViewModel} from "../../../models/blog-models/BlogViewModel";

import {ObjectId} from "mongodb";
import {BlogType} from "../../../db/db-blogs-type";

import {QueryInputModel} from "../../../models/QueryInputModel";
import {limitPages} from "../../../helpers/limitPages";
import {pageCount} from "../../../helpers/pageCount";
import {QueryViewModel} from "../../../models/QueryViewModel";
import {BlogModelClass} from "../../../domain/schema-blog";
import {injectable} from "inversify";


@injectable()
export class QueryBlogsRepository {
    async allBlogs(query: QueryInputModel): Promise<QueryViewModel<BlogViewModel>> {
        const {
            searchNameTerm = null,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10
        } = query

        const totalCount = await BlogModelClass.countDocuments({
            name: {
                $regex: `${searchNameTerm ? searchNameTerm : ''}`,
                $options: 'i'
            }
        })

        const items = await BlogModelClass.find({
            name: {
                $regex: `${searchNameTerm ? searchNameTerm : ''}`,
                $options: 'i'
            }
        })
            .sort(sortDirection === 'asc' ? `${sortBy}` : `-${sortBy}`)
            .skip(limitPages(+pageNumber, +pageSize))
            .limit(+pageSize)
            .lean()
            .then((blogs) => {
                return Array.from(blogs).map((blog: BlogType) => this._mapBlog(blog))
            })

        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items
        }

    }

    async findBlog(id: ObjectId): Promise<BlogViewModel | null> {

        const foundBlog: BlogType | null = await BlogModelClass.findOne(id)
        if (!foundBlog) {
            return null
        }
        return this._mapBlog(foundBlog)
    }

    _mapBlog(blog: BlogType) {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,

        }
    }
}



