import {NextFunction, Request, Response} from "express";
import {JwtService} from "../application/jwt-service";
import {RESPONSE_STATUS} from "../types/res-status";
import {UserModelClass} from "../db/schemas/schema-user";


export const jwtMiddleware = async(req: Request, res: Response, next: NextFunction)=>{
    if(!req.headers.authorization){
        res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const userId = await new JwtService().getUserIdByToken(token)
    if(userId){
        const user =  await UserModelClass.findOne(userId)
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