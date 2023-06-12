import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {collectionRefreshTokens, collectionUsers} from "../db/db";
import {RESPONSE_STATUS} from "../types/resStatus";

export const jwtRefreshMiddleware = async(req: Request, res: Response, next: NextFunction)=>{
    if(!req.cookies.refreshToken){
        res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
        return
    }
    const refreshToken = req.cookies.refreshToken

    const refreshTokenIsValid = await collectionRefreshTokens.findOne({refreshToken: refreshToken})
    if(refreshTokenIsValid){
        res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
        return
    }

    const userId = await jwtService.verifyRefreshToken(refreshToken)
    if(userId){
        const user =  await collectionUsers.findOne(userId)
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