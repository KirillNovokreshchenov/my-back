import {NextFunction, Request, Response} from "express";
import {JwtService} from "../application/jwt-service";
import {RESPONSE_STATUS} from "../types/res-status";
import {ObjectId} from "mongodb";
import {UserModelClass} from "../db/schemas/schema-user";
import {jwtService} from "../composition-root";

export const jwtRefreshMiddleware = async(req: Request, res: Response, next: NextFunction)=>{
    if(!req.cookies.refreshToken){
        res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
        return
    }
    const refreshToken = req.cookies.refreshToken

    // const refreshTokenIsValid = await collectionRefreshTokens.findOne({refreshToken: refreshToken})
    // if(refreshTokenIsValid){
    //     res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
    //     return
    // }

    const tokenVerify = await jwtService.verifyRefreshToken(refreshToken)

    if(tokenVerify){
        const user =  await UserModelClass.findOne(new ObjectId(tokenVerify.userId))
        if(!user) {
            res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
            return
        }
        req.user = user
        req.deviceId = tokenVerify.deviceId
        next()
    } else {
        res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
        return
    }

}