import mongoose from "mongoose";
import {RateLimitType} from "../db-users-type";


const RateLimitSchema = new mongoose.Schema<RateLimitType>({
        ip: String,
        url: String,
        date: Date
})


export const RateLimitModelClass = mongoose.model('RateLimit', RateLimitSchema)
