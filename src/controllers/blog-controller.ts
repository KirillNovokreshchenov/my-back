import {QueryBlogsRepository} from "../infrastructure/repositories/query-repositories/query-blogs-repository";
import {BlogsService} from "../application/blogs-service";
import {PostsQueryRepository} from "../infrastructure/repositories/query-repositories/query-posts-repository";
import {
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithQuery,
    RequestWithQueryAndParams
} from "../types/types";
import {QueryInputModel} from "../models/QueryInputModel";
import {Response} from "express";
import {QueryViewModel} from "../models/QueryViewModel";
import {BlogViewModel} from "../models/blog-models/BlogViewModel";
import {URIParamsId} from "../models/URIParamsIdModel";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {ObjectId} from "mongodb";
import {RESPONSE_STATUS} from "../types/res-status";
import {CreateAndUpdateBlogInputModel} from "../models/blog-models/CreateAndUpdateBlogInputModel";
import {CreateModelPostForBlog} from "../models/blog-models/CreateModelPostForBlog";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsController {

    constructor(@inject(QueryBlogsRepository)protected blogsQueryRepository: QueryBlogsRepository,
                @inject(BlogsService)protected blogsService: BlogsService,
                @inject(PostsQueryRepository)protected postsQueryRepository: PostsQueryRepository) {

    }


    async getBlogs(req: RequestWithQuery<QueryInputModel>, res: Response<QueryViewModel<BlogViewModel>>) {
        const allBlogs = await this.blogsQueryRepository.allBlogs(req.query)
        res.json(allBlogs)
    }

    async getAllPostsForBlog(req: RequestWithQueryAndParams<URIParamsId, QueryInputModel>, res: Response<QueryViewModel<PostViewModel>>) {

        const blogIsExists = this.blogsQueryRepository.findBlog(new ObjectId(req.params.id))
        if (!blogIsExists) return res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)

        const allPostsForBlog = await this.postsQueryRepository.allPosts(req.query, req.params.id)
        return res.send(allPostsForBlog)
    }

    async createBlog(req: RequestWithBody<CreateAndUpdateBlogInputModel>, res: Response<BlogViewModel>) {
        const idBlog = await this.blogsService.createBlog(req.body)
        const newBlog = await this.blogsQueryRepository.findBlog(idBlog)
        if (!newBlog) {
            res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
            return
        }
        res.status(RESPONSE_STATUS.CREATED_201).send(newBlog)
    }

    async createPostForBlog(req: RequestWithBodyAndParams<URIParamsId, CreateModelPostForBlog>, res: Response<PostViewModel>) {

        const idPost = await this.blogsService.createPostForBlog(req.params.id, req.body)
        if (!idPost) {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
            return
        }
        const foundNewPost = await this.postsQueryRepository.findPost(idPost)

        if (!foundNewPost) {
            res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
            return
        }
        res.status(RESPONSE_STATUS.CREATED_201).send(foundNewPost)

    }

    async getBlogById(req: RequestWithParams<URIParamsId>, res: Response<BlogViewModel>) {
        const foundBlog = await this.blogsQueryRepository.findBlog(formatIdInObjectId(req.params.id))
        if (foundBlog) {
            res.send(foundBlog)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

    async updateBlog(req: RequestWithBodyAndParams<URIParamsId, CreateAndUpdateBlogInputModel>, res: Response) {
        const isUpdate: boolean = await this.blogsService.updateBlog(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

    async deleteBlog(req: RequestWithParams<URIParamsId>, res: Response) {
        const isDeleted: boolean = await this.blogsService.deleteBlog(req.params.id)
        if (isDeleted) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

}