import {PostsQueryRepository} from "../repositories/query-posts-repository";
import {PostsService} from "../domain/posts-service";
import {CommentsService} from "../domain/comments-service";
import {QueryCommentsRepository} from "../repositories/query-comments-repository";
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
import {PostViewModel} from "../models/post-models/PostViewModel";
import {URIParamsId} from "../models/URIParamsIdModel";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {RESPONSE_STATUS} from "../types/res-status";
import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";
import {CommentCreateAndUpdateModel} from "../models/comment-models/CommentCreateAndUpdateModel";
import {CommentViewModel} from "../models/comment-models/CommentViewModel";
import {CommentsQueryInputModel} from "../models/comment-models/CommentsQueryInputModel";

export class PostsController {


    constructor(protected postsQueryRepository: PostsQueryRepository,
                protected postsService: PostsService,
                protected commentsService: CommentsService,
                protected queryCommentsRepository: QueryCommentsRepository) {

    }

    async getPosts(req: RequestWithQuery<QueryInputModel>, res: Response<QueryViewModel<PostViewModel>>) {
        const allPosts = await this.postsQueryRepository.allPosts(req.query)
        res.send(allPosts)
    }

    async getPost(req: RequestWithParams<URIParamsId>, res: Response<PostViewModel>) {
        const foundPost = await this.postsQueryRepository.findPost(formatIdInObjectId(req.params.id))
        if (foundPost) {
            res.send(foundPost)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

    async createPost(req: RequestWithBody<CreateAndUpdatePostModel>, res: Response<PostViewModel>) {
        const objId = await this.postsService.createPost(req.body)
        if (!objId) {
            res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
            return
        }
        const foundNewCreatePost = await this.postsQueryRepository.findPost(objId)
        if (!foundNewCreatePost) {
            res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
            return
        }
        res.status(RESPONSE_STATUS.CREATED_201).send(foundNewCreatePost)
    }

    async updatePost(req: RequestWithBodyAndParams<URIParamsId, CreateAndUpdatePostModel>, res: Response) {
        const isUpdate = await this.postsService.updatePost(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

    async deletePost(req: RequestWithParams<URIParamsId>, res: Response) {
        const isDeleted: boolean = await this.postsService.deletePost(req.params.id)
        if (isDeleted) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }

    async createCommentForPost(req: RequestWithBodyAndParams<URIParamsId, CommentCreateAndUpdateModel>, res: Response<CommentViewModel>) {

        const commentId = await this.commentsService.createComment(req.params.id, req.user!, req.body.content)
        if (!commentId) {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        } else {
            const newComment = await this.queryCommentsRepository.findComment(commentId)
            res.status(RESPONSE_STATUS.CREATED_201).send(newComment!)
        }
    }

    async getCommentsForPost(req: RequestWithQueryAndParams<URIParamsId, CommentsQueryInputModel>, res: Response<QueryViewModel<CommentViewModel>>) {
        const comments = await this.queryCommentsRepository.getComments(req.params.id, req.query)
        if (!comments) {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        } else {
            res.send(comments)
        }
    }

}