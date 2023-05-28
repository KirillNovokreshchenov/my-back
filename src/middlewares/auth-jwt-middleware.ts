import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {collectionUsers} from "../db/db";


export const jwtMiddleware = async(req: Request, res: Response, next: NextFunction)=>{
    if(!req.headers.authorization){
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
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