import {NextFunction, Request, Response} from "express";
import {BSON, ObjectId} from "mongodb";
import {param} from "express-validator";

export const mongoIdMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    if(ObjectId.isValid(req.params.id)){
        next()
    } else {
        res.sendStatus(404)
    }

}