import {Request, Response, Router} from "express";
import {jwtRefreshMiddleware} from "../middlewares/auth-refresh-middleware";
import {UsersQueryRepository} from "../repositories/query-users-repository";
import {DeviceSessionModel} from "../models/user-models/DeviceSessionModel";
import {JwtService} from "../application/jwt-service";
import {RESPONSE_OPTIONS} from "../types/res-status";
import {RESPONSE_STATUS} from "../types/res-status";
import {deviceController} from "../composition-root";


export const deviseRouter = Router({})




deviseRouter.get('/',
    jwtRefreshMiddleware,
    deviceController.getSessions.bind(deviceController))

deviseRouter.delete('/',
    jwtRefreshMiddleware,
    deviceController.deleteAllSessions.bind(deviceController))

deviseRouter.delete('/:id',
    jwtRefreshMiddleware,
    deviceController.deleteSessionById.bind(deviceController))
