import {NextFunction, Request, Response} from "express";
import {JwtService} from "../application/jwt-service";
import {RESPONSE_STATUS} from "../types/res-status";
import {UserMethods, UserModelClass} from "../domain/schema-user";
import {iocContainer} from "../composition-root";
import {HydratedDocument} from "mongoose";
import {UserType} from "../db/db-users-type";


const jwtService = iocContainer.resolve(JwtService)
const jwtAuthMiddleware = async(req: Request, res: Response, next: NextFunction)=>{
    if(!req.headers.authorization){
        res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if(userId){
        const user: UserType|null =  await UserModelClass.findOne(userId).exec()
        if(!user) {
            res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
            return
        } 
        req.user = user
        next()
    } else {
        res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
        return
    }

}

export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    await jwtAuthMiddleware(req, res, next)
}

export const likeStatusMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        await jwtAuthMiddleware(req, res, next)
    } else{
        next()
    }

}