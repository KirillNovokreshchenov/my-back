import {UsersQueryRepository} from "../infrastructure/repositories/query-repositories/query-users-repository";
import {JwtService} from "../application/jwt-service";
import {Request, Response} from "express";
import {DeviceSessionModel} from "../models/user-models/DeviceSessionModel";
import {RESPONSE_OPTIONS, RESPONSE_STATUS} from "../types/res-status";
import {inject, injectable} from "inversify";

@injectable()
export class DeviceController {

    constructor(@inject(UsersQueryRepository)protected usersQueryRepository: UsersQueryRepository,
                @inject(JwtService)protected jwtService: JwtService) {
    }

    async getSessions(req: Request, res: Response<DeviceSessionModel[]>) {
        const allSessions = await this.usersQueryRepository.getAllSessions(req.user!._id)
        res.status(200).send(allSessions)
    }

    async deleteAllSessions(req: Request, res: Response) {
        const isDeleted = await this.jwtService.deleteAllSessions(req.user!._id, req.deviceId)
        if (!isDeleted) {
            res.sendStatus(401)
        } else {
            res.sendStatus(204)
        }
    }

    async deleteSessionById(req: Request, res: Response) {
        const condition = await this.jwtService.deleteSession(req.user!._id, req.params.id)
        switch (condition) {
            case RESPONSE_OPTIONS.NOT_FOUND:
                res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
                break;
            case RESPONSE_OPTIONS.FORBIDDEN:
                res.sendStatus(RESPONSE_STATUS.FORBIDDEN_403)
                break
            case RESPONSE_OPTIONS.NO_CONTENT:
                res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
                break
        }

    }

}