import {Router} from "express";
import {postValidate} from "../middlewares/post-middleware";
import {authorizationValidation} from "../middlewares/auth-middleware";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {jwtMiddleware, likeStatusMiddleware} from "../middlewares/auth-jwt-middleware";
import {contentValidation, likeStatusValidation} from "../middlewares/comment-middleware";
import {errorsValidationMiddleware} from "../middlewares/err-middleware";
import {iocContainer} from "../composition-root";
import {PostsController} from "../controllers/post-controller";

const postsController = iocContainer.resolve(PostsController)

export const postRouter = Router()


postRouter.get('/',
    likeStatusMiddleware,
    postsController.getPosts.bind(postsController))

postRouter.post('/',
    postValidate,
    postsController.createPost.bind(postsController))

postRouter.get('/:id',
    likeStatusMiddleware,
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

postRouter.put('/:id/like-status',
    jwtMiddleware,
    mongoIdMiddleware,
    likeStatusValidation,
    errorsValidationMiddleware,
    postsController.updateLikeStatus.bind(postsController))


postRouter.post('/:id/comments',
    jwtMiddleware,
    mongoIdMiddleware,
    contentValidation,
    errorsValidationMiddleware,
    postsController.createCommentForPost.bind(postsController))

postRouter.get('/:id/comments',
    likeStatusMiddleware,
    postsController.getCommentsForPost.bind(postsController))

