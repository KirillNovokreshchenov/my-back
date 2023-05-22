import {Response, Router} from "express";
import {userValidation} from "../middlewares/user-middleware";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types";
import {CreateUserInputModel} from "../models/user-models/CreateUserInputModel";
import {UserViewModel} from "../models/user-models/UserViewModel";
import {usersService} from "../domain/users-service";
import {usersQueryRepository} from "../repositories/query-users-repository";
import {authorizationValidation} from "../middlewares/auth-middleware";
import {UsersQueryViewModel} from "../models/user-models/UsersQueryViewModel";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {URIParamsId} from "../models/URIParamsIdModel";


export const userRouter = Router()

userRouter.get('/',
    authorizationValidation,
    async (req: RequestWithQuery<any>, res: Response<UsersQueryViewModel>) => {
        const allUsers = await usersQueryRepository.allUsers(req.query)
        res.send(allUsers)
    })

userRouter.post('/',
    userValidation,
    async (req: RequestWithBody<CreateUserInputModel>, res: Response<UserViewModel>) => {
        const userObjectId = await usersService.createUser(req.body)
        const newUser = await usersQueryRepository.findUser(userObjectId)
        res.status(201).send(newUser)

    })

userRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    async(req: RequestWithParams<URIParamsId>, res: Response)=>{
        const isDeleted: boolean = await usersService.deleteUser(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
    )