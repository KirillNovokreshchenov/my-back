import {Request, Router, Response} from "express";
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
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/query-posts-repository";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {QueryInputModel} from "../models/QueryInputModel";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {QueryViewModel} from "../models/QueryViewModel";
import {jwtMiddleware} from "../middlewares/auth-jwt-middleware";
import {contentValidation} from "../middlewares/comment-middleware";
import {commentsService} from "../domain/comments-service";
import {queryCommentsRepository} from "../repositories/query-comments-repository";
import {CommentType} from "../db/db-comments-type";
import {CommentViewModel} from "../models/comment-models/CommentViewModel";
import {CommentCreateAndUpdateModel} from "../models/comment-models/CommentCreateAndUpdateModel";
import {CommentsQueryInputModel} from "../models/comment-models/CommentsQueryInputModel";


export const postRouter = Router()

postRouter.get('/', async (req: RequestWithQuery<QueryInputModel>, res: Response<QueryViewModel<PostViewModel>>) => {
    const allPosts = await postsQueryRepository.allPosts(req.query)
    res.send(allPosts)
})

postRouter.post('/',
    postValidate,
    async (req: RequestWithBody<CreateAndUpdatePostModel>, res: Response<PostViewModel>) => {
        const objId = await postsService.createPost(req.body)
        const foundNewCreatePost = await postsQueryRepository.findPost(objId)
        res.status(201).send(foundNewCreatePost!)
    })

postRouter.get('/:id',
    mongoIdMiddleware,
    async (req: RequestWithParams<URIParamsId>, res: Response<PostViewModel>) => {
        const foundPost = await postsQueryRepository.findPost(formatIdInObjectId(req.params.id))
        if (foundPost) {
            res.send(foundPost)
        } else {
            res.sendStatus(404)
        }
    })

postRouter.put('/:id',
    postValidate,
    mongoIdMiddleware,
    async (req: RequestWithBodyAndParams<URIParamsId, CreateAndUpdatePostModel>, res: Response) => {
        const isUpdate = await postsService.updatePost(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

postRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    async (req: RequestWithParams<URIParamsId>, res: Response) => {
        const isDeleted: boolean = await postsService.deletePost(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })


postRouter.post('/:id/comments',
    jwtMiddleware,
    mongoIdMiddleware,
    contentValidation,
    async (req: RequestWithBodyAndParams<URIParamsId, CommentCreateAndUpdateModel>, res: Response<CommentViewModel>) => {
        const commentId = await commentsService.createComment(req.params.id, req.user!, req.body.content)
        if(!commentId){
            res.sendStatus(404)
        } else{
            const newComment = await queryCommentsRepository.findComment(commentId)
            res.send(newComment!)
        }
    })

postRouter.get('/:id/comments', async(req: RequestWithQueryAndParams<URIParamsId, CommentsQueryInputModel>, res: Response<QueryViewModel<CommentViewModel>>)=>{
    const comments = await queryCommentsRepository.getComments(req.params.id, req.query)
    if(!comments){
        res.sendStatus(404)
    } else {
        res.send(comments)
    }
})

