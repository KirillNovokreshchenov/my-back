import {Router} from "express";
import {userValidation} from "../middlewares/user-middleware";
import {authorizationValidation} from "../middlewares/auth-middleware";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {usersController} from "../composition-root";


export const userRouter = Router()


userRouter.get('/',
    authorizationValidation,
    usersController.getUsers.bind(usersController)
)
userRouter.post('/',
    userValidation, usersController.createUser.bind(usersController))

userRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    usersController.deleteUser.bind(usersController)
)