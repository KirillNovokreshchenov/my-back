import {NextFunction, Request, Response} from "express";
import {BSON, ObjectId} from "mongodb";


export const mongoIdMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    if(ObjectId.isValid(req.params.id)){
        next()
    } else {
        res.sendStatus(404)
    }

}