import {UsersService} from "../application/users-service";
import {UsersQueryRepository} from "../infrastructure/repositories/query-repositories/query-users-repository";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {UsersQueryInputModel} from "../models/user-models/UsersQueryInputModel";
import {Response} from "express";
import {QueryViewModel} from "../models/QueryViewModel";
import {UserViewModel} from "../models/user-models/UserViewModel";
import {UserInputModel} from "../models/user-models/UserInputModel";
import {RESPONSE_STATUS} from "../types/res-status";
import {URIParamsId} from "../models/URIParamsIdModel";
import {inject, injectable} from "inversify";

@injectable()
export class UsersController {

    constructor(
        @inject(UsersService)protected usersService: UsersService,
        @inject(UsersQueryRepository)protected usersQueryRepository: UsersQueryRepository) {

    }


    async getUsers(req: RequestWithQuery<UsersQueryInputModel>, res: Response<QueryViewModel<UserViewModel>>) {
        const allUsers = await this.usersQueryRepository.allUsers(req.query)
        res.send(allUsers)
    }

    async createUser(req: RequestWithBody<UserInputModel>, res: Response<UserViewModel>) {
        const userObjectId = await this.usersService.createUserByAdmin(req.body)
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