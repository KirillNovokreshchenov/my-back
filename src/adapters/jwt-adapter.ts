import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {settings} from "../settings";
import {uuid} from "uuidv4";
import {add} from "date-fns";


export class JwtAdapter {
    async signAccessToken(userId: ObjectId) {
        return jwt.sign({userId: userId}, settings.SECRET_JWT, {expiresIn: '10m'})
    }

    async signRefreshToken(userId: ObjectId, deviceId: string, date: Date) {
        return jwt.sign({
            userId: userId,
            deviceId: deviceId,
            lastActiveDate: date
        }, settings.SECRET_REFRESH, {expiresIn: '20m'})
    }

    async verifyAccessToken(token: string){
        return jwt.verify(token, settings.SECRET_JWT)
    }
    async verifyRefreshToken(token: string){
        return jwt.verify(token, settings.SECRET_REFRESH)
    }

    async createId(){
        return uuid()
    }
    async createExpDate(date: Date){
        return add(date, {
            minutes: 20
        })
    }
}