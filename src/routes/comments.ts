import {Router} from "express";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {jwtMiddleware} from "../middlewares/auth-jwt-middleware";
import {contentValidation} from "../middlewares/comment-middleware";
import {errorsValidationMiddleware} from "../middlewares/err-middleware";
import {commentsController} from "../composition-root";


export const commentRouter = Router()

commentRouter.get('/:id',
    mongoIdMiddleware,
    commentsController.getComment.bind(commentsController))

commentRouter.put('/:id',
    jwtMiddleware,
    mongoIdMiddleware,
    contentValidation,
    errorsValidationMiddleware,
    commentsController.updateComment.bind(commentsController))

commentRouter.delete('/:id',
    jwtMiddleware,
    mongoIdMiddleware,
    commentsController.deleteComment.bind(commentsController))