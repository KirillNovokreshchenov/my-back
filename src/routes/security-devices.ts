import {Request, Response, Router} from "express";
import {jwtRefreshMiddleware} from "../middlewares/auth-refresh-middleware";
import {usersQueryRepository} from "../repositories/query-users-repository";
import {DeviceSessionModel} from "../models/user-models/DeviceSessionModel";
import {jwtService} from "../application/jwt-service";
import {RESPONSE_OPTIONS} from "../types/res-status";
import {RESPONSE_STATUS} from "../types/res-status";


export const deviseRouter = Router({})

class DeviceController {

    async getSessions(req: Request, res: Response<DeviceSessionModel[]>) {
        const allSessions = await usersQueryRepository.getAllSessions(req.user!._id)
        res.status(200).send(allSessions)
    }

    async deleteAllSessions(req: Request, res: Response) {
        const isDeleted = await jwtService.deleteAllSessions(req.user!._id, req.deviceId)
        if (!isDeleted) {
            res.sendStatus(401)
        } else {
            res.sendStatus(204)
        }
    }

    async deleteSessionById(req: Request, res: Response) {
        const condition = await jwtService.deleteSession(req.user!._id, req.params.id)
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

const deviceController = new DeviceController()

deviseRouter.get('/',
    jwtRefreshMiddleware,
    deviceController.getSessions)

deviseRouter.delete('/',
    jwtRefreshMiddleware,
    deviceController.deleteAllSessions)

deviseRouter.delete('/:id',
    jwtRefreshMiddleware,
    deviceController.deleteSessionById)
