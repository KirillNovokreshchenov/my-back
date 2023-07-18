import {NextFunction, Request, Response} from "express";

import {RateLimitType} from "../db/db-users-type";
import {addSeconds} from "date-fns";
import {RateLimitModelClass} from "../domain/schema-rate-limits";


export const rateLimitsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const rate = await new RateLimitType(
        req.ip,
        req.url,
        new Date())
    await RateLimitModelClass.create(rate)
    const totalCount = await RateLimitModelClass.countDocuments({$and: [{ip: rate.ip}, {url: rate.url}, {date: {$gte: addSeconds(new Date(), -10)}}]})
    if(totalCount>5){
        res.sendStatus(429)
        return
    } else{
        next()
    }

}