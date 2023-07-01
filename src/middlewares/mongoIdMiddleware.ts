import {NextFunction, Request, Response} from "express";
import {BSON, ObjectId} from "mongodb";
import {RESPONSE_STATUS} from "../types/res-status";


export const mongoIdMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    if(ObjectId.isValid(req.params.id)){
        next()
    } else {
        res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
    }

}