import {Response, Router} from "express";
import {userValidation} from "../middlewares/user-middleware";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {UserInputModel} from "../models/user-models/UserInputModel";
import {UserViewModel} from "../models/user-models/UserViewModel";
import {UsersService, } from "../domain/users-service";
import {UsersQueryRepository} from "../repositories/query-users-repository";
import {authorizationValidation} from "../middlewares/auth-middleware";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {URIParamsId} from "../models/URIParamsIdModel";
import {UsersQueryInputModel} from "../models/user-models/UsersQueryInputModel";
import {QueryViewModel} from "../models/QueryViewModel";
import {RESPONSE_STATUS} from "../types/res-status";


export const userRouter = Router()

class UsersController {
    private usersService: UsersService;
    private usersQueryRepository: UsersQueryRepository;

    constructor() {
        this.usersService = new UsersService()
        this.usersQueryRepository = new UsersQueryRepository()
    }


    async getUsers(req: RequestWithQuery<UsersQueryInputModel>, res: Response<QueryViewModel<UserViewModel>>) {
        const allUsers = await this.usersQueryRepository.allUsers(req.query)
        res.send(allUsers)
    }

    async createUser(req: RequestWithBody<UserInputModel>, res: Response<UserViewModel>) {
        const userObjectId = await this.usersService.createUser(req.body)
        const newUser = await this.usersQueryRepository.findUser(userObjectId)
        if (!newUser) {
            return res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
        }
        return res.status(RESPONSE_STATUS.CREATED_201).send(newUser)
    }

    async deleteUser(req: RequestWithParams<URIParamsId>, res: Response) {
        const isDeleted: boolean = await this.usersService.deleteUser(req.params.id)
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
    usersController.getUsers.bind(usersController)
)
userRouter.post('/',
    userValidation, usersController.createUser.bind(usersController))

userRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    usersController.deleteUser.bind(usersController)
)