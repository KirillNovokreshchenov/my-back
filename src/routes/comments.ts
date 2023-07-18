import {Router} from "express";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {jwtMiddleware, likeStatusMiddleware} from "../middlewares/auth-jwt-middleware";
import {contentValidation, likeStatusValidation} from "../middlewares/comment-middleware";
import {errorsValidationMiddleware} from "../middlewares/err-middleware";
import {iocContainer} from "../composition-root";

import {CommentsController} from "../controllers/comment-controller";

const commentsController = iocContainer.resolve(CommentsController)

export const commentRouter = Router()

commentRouter.get('/:id',
    likeStatusMiddleware,
    mongoIdMiddleware,
    commentsController.getComment.bind(commentsController))

commentRouter.put('/:id',
    jwtMiddleware,
    mongoIdMiddleware,
    contentValidation,
    errorsValidationMiddleware,
    commentsController.updateComment.bind(commentsController))

commentRouter.put('/:id/like-status',
    jwtMiddleware,
    mongoIdMiddleware,
    likeStatusValidation,
    errorsValidationMiddleware,
    commentsController.likeStatus.bind(commentsController))

commentRouter.delete('/:id',
    jwtMiddleware,
    mongoIdMiddleware,
    commentsController.deleteComment.bind(commentsController))

