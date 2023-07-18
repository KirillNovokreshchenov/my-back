import {UserType} from "../db/db-users-type";

declare global {
    namespace Express {
        export interface Request {
            user: UserType | null
            deviceId: string
        }
    }
}