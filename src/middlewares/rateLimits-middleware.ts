import {NextFunction, Request, Response} from "express";
import {collectionRateLimits} from "../db/db";
import {RateLimit} from "../db/db-users-type";
import {addSeconds} from "date-fns";


export const rateLimitsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const rate: RateLimit = {
        ip: req.ip,
        url: req.url,
        date: new Date()
    }
    await collectionRateLimits.insertOne(rate)
    const totalCount = await collectionRateLimits.countDocuments({$and: [{ip: rate.ip}, {url: rate.url}, {date: {$gte: addSeconds(new Date(), -10)}}]})
    if(totalCount>5){
        res.sendStatus(429)
        return
    } else{
        next()
    }

}