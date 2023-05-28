import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {settings} from "../settings";

export const jwtService = {
    async createJWT(userId: ObjectId){
        const token = jwt.sign({userId: userId}, settings.SECRET_JWT, {expiresIn: '24h'})
        return {
            accessToken: token
        }
    },
    async getUserIdByToken(token: string){
        try {
            const result: any = jwt.verify(token, settings.SECRET_JWT)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }

    }

}