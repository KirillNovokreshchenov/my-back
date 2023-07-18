import {Router} from "express";
import {jwtRefreshMiddleware} from "../middlewares/auth-refresh-middleware";
import {iocContainer} from "../composition-root";
import {DeviceController} from "../controllers/security-device-controller";

const deviceController = iocContainer.resolve(DeviceController)

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
