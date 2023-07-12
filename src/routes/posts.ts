import {Router} from "express";
import {postValidate} from "../middlewares/post-middleware";
import {authorizationValidation} from "../middlewares/auth-middleware";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {jwtMiddleware, likeStatusMiddleware} from "../middlewares/auth-jwt-middleware";
import {contentValidation} from "../middlewares/comment-middleware";
import {errorsValidationMiddleware} from "../middlewares/err-middleware";
import {postsController} from "../composition-root";



export const postRouter = Router()


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
    likeStatusMiddleware,
    postsController.getCommentsForPost.bind(postsController))

