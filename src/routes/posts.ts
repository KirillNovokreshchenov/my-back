import {Router, Response} from "express";
import {PostViewModel} from "../models/post-models/PostViewModel";
import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";
import {
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithQuery,
    RequestWithQueryAndParams
} from "../types/types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {postValidate} from "../middlewares/post-middleware";
import {authorizationValidation} from "../middlewares/auth-middleware";
import {PostsService} from "../domain/posts-service";
import {PostsQueryRepository} from "../repositories/query-posts-repository";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {QueryInputModel} from "../models/QueryInputModel";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {QueryViewModel} from "../models/QueryViewModel";
import {jwtMiddleware} from "../middlewares/auth-jwt-middleware";
import {contentValidation} from "../middlewares/comment-middleware";
import {CommentsService} from "../domain/comments-service";
import {QueryCommentsRepository} from "../repositories/query-comments-repository";
import {CommentViewModel} from "../models/comment-models/CommentViewModel";
import {CommentCreateAndUpdateModel} from "../models/comment-models/CommentCreateAndUpdateModel";
import {CommentsQueryInputModel} from "../models/comment-models/CommentsQueryInputModel";
import {errorsValidationMiddleware} from "../middlewares/err-middleware";
import {RESPONSE_STATUS} from "../types/res-status";


export const postRouter = Router()

class PostsController {

    private postsQueryRepository: PostsQueryRepository
    private postsService: PostsService
    private commentsService: CommentsService
    private queryCommentsRepository: QueryCommentsRepository

    constructor() {
        this.postsService = new PostsService()
        this.postsQueryRepository = new PostsQueryRepository()
        this.queryCommentsRepository = new QueryCommentsRepository()
        this.commentsService = new CommentsService()
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

const postsController = new PostsController()

postRouter.get('/', postsController.getPosts.bind(postsController))

postRouter.post('/',
    postValidate,
    postsController.createPost.bind(postsController))

postRouter.get('/:id',
    mongoIdMiddleware,
    postsController.getPost.bind(postsController))

postRouter.put('/:id',
    postValidate,
    mongoIdMiddleware,
    postsController.updatePost.bind(postsController))

postRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    postsController.deletePost.bind(postsController))


postRouter.post('/:id/comments',
    jwtMiddleware,
    mongoIdMiddleware,
    contentValidation,
    errorsValidationMiddleware,
    postsController.createCommentForPost.bind(postsController))

postRouter.get('/:id/comments',
    postsController.getCommentsForPost.bind(postsController))

