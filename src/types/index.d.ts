
import {Express} from "express-serve-static-core"
import {ObjectId} from "mongodb";
import {UserType} from "../db/db-users-type";
declare global {
    namespace Express {
        export interface Request {
            user: UserType | null
        }
    }
}