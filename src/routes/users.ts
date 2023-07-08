import {Response, Router} from "express";
import {userValidation} from "../middlewares/user-middleware";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {UserInputModel} from "../models/user-models/UserInputModel";
import {UserViewModel} from "../models/user-models/UserViewModel";
import {usersService} from "../domain/users-service";
import {usersQueryRepository} from "../repositories/query-users-repository";
import {authorizationValidation} from "../middlewares/auth-middleware";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {URIParamsId} from "../models/URIParamsIdModel";
import {UsersQueryInputModel} from "../models/user-models/UsersQueryInputModel";
import {QueryViewModel} from "../models/QueryViewModel";
import {RESPONSE_STATUS} from "../types/res-status";


export const userRouter = Router()

class UsersController {
    async getUsers(req: RequestWithQuery<UsersQueryInputModel>, res: Response<QueryViewModel<UserViewModel>>) {
        const allUsers = await usersQueryRepository.allUsers(req.query)
        res.send(allUsers)
    }

    async createUser(req: RequestWithBody<UserInputModel>, res: Response<UserViewModel>) {
        const userObjectId = await usersService.createUser(req.body)
        const newUser = await usersQueryRepository.findUser(userObjectId)
        if (!newUser) {
            return res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
        }
        return res.status(RESPONSE_STATUS.CREATED_201).send(newUser)
    }

    async deleteUser(req: RequestWithParams<URIParamsId>, res: Response) {
        const isDeleted: boolean = await usersService.deleteUser(req.params.id)
        if (isDeleted) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }
}


const usersController = new UsersController()

userRouter.get('/',
    authorizationValidation,
    usersController.getUsers
)

userRouter.post('/',
    userValidation, usersController.createUser)

userRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    usersController.deleteUser
)