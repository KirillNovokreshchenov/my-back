import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {settings} from "../settings";
import {add} from "date-fns";
import {RefreshTokenType} from "../db/db-users-type";
import {usersRepository} from "../repositories/users-repository";

export const jwtService = {
    async createJWT(userId: ObjectId) {
        const token = jwt.sign({userId: userId}, settings.SECRET_JWT, {expiresIn: '10m'})
        const refreshToken = jwt.sign({userId: userId}, settings.SECRET_REFRESH, {expiresIn: '20m'})
        return {
            accessToken: {
                accessToken: token
            },
            refreshToken: refreshToken
        }
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.SECRET_JWT)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }

    },
    async verifyRefreshToken(refreshToken: string){
        try {
            const result: any = jwt.verify(refreshToken, settings.SECRET_REFRESH)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    },
    async addRefreshTokenToBlackList(userId: ObjectId, refreshToken: string){
        const refreshTokenToBlackList: RefreshTokenType = {
            userId: userId,
            refreshToken: refreshToken
        }
        await usersRepository.blackListRefreshToken(refreshTokenToBlackList)
    }
}