import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {collectionRefreshTokens, collectionUsers} from "../db/db";

export const jwtRefreshMiddleware = async(req: Request, res: Response, next: NextFunction)=>{
    if(!req.cookies.refreshJWT){
        res.sendStatus(401)
        return
    }
    const refreshToken = req.cookies.refreshJWT

    const refreshTokenIsValid = await collectionRefreshTokens.findOne({refreshToken: refreshToken})
    if(refreshTokenIsValid){
        res.sendStatus(401)
        return
    }

    const userId = await jwtService.verifyRefreshToken(refreshToken)
    if(userId){
        const user =  await collectionUsers.findOne(userId)
        if(!user) {
            res.sendStatus(401)
            return
        }
        req.user = user
        next()
    } else {
        res.sendStatus(401)
        return
    }

}