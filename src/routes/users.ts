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
import {RESPONSE_STATUS} from "../types/resStatus";


export const userRouter = Router()

userRouter.get('/',
    authorizationValidation,
    async (req: RequestWithQuery<UsersQueryInputModel>, res: Response<QueryViewModel<UserViewModel>>) => {
        const allUsers = await usersQueryRepository.allUsers(req.query)
        res.send(allUsers)
    })

userRouter.post('/',
    userValidation,
    async (req: RequestWithBody<UserInputModel>, res: Response<UserViewModel>) => {
        const userObjectId = await usersService.createUser(req.body)
        const newUser = await usersQueryRepository.findUser(userObjectId)
        res.status(RESPONSE_STATUS.CREATED_201).send(newUser)

    })

userRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    async(req: RequestWithParams<URIParamsId>, res: Response)=>{
        const isDeleted: boolean = await usersService.deleteUser(req.params.id)
        if (isDeleted) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
        }
    }
    )