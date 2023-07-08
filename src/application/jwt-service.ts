import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {settings} from "../settings";
import {usersRepository} from "../repositories/users-repository";
import {uuid} from "uuidv4";
import {add} from "date-fns";
import {usersQueryRepository} from "../repositories/query-users-repository";
import {RESPONSE_OPTIONS} from "../types/res-status";
import {sessionsRepository} from "../repositories/sessions-repository";
import {DeviceAuthSessionType} from "../db/db-users-type";


class JwtService {
    async createJWT(userId: ObjectId, ip: string, deviceName = "Chrome") {

        const dateForSessions = new Date()
        const deviceId = uuid()

        const bothTokens = await this._createTokens(userId, deviceId, dateForSessions)

        const DevicesAuthSessions: DeviceAuthSessionType = new DeviceAuthSessionType(
            new ObjectId(),
            userId,
            ip,
            deviceName,
            dateForSessions,
            add(dateForSessions, {
            minutes: 20
        }),
            deviceId,
        )

        await sessionsRepository.createDeviceSession(DevicesAuthSessions)

        return bothTokens
    }

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.SECRET_JWT)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }

    }
    async verifyRefreshToken(refreshToken: string) {
        try {
            const result: any = jwt.verify(refreshToken, settings.SECRET_REFRESH)
            const deviceSession = await usersQueryRepository.findDeviceSession(result.deviceId, result.lastActiveDate)
            if (!deviceSession) {
                return null
            }
            return result
        } catch (error) {
            return null
        }
    }

    async newTokens(userId: ObjectId, deviceId: string) {
        const newDate = new Date()
        const tokens = this._createTokens(userId, deviceId, newDate)
        await sessionsRepository.updateDate(deviceId, newDate)
        return tokens

    }

    async _createTokens(userId: ObjectId, deviceId: string, date: Date) {

        const token = jwt.sign({userId: userId}, settings.SECRET_JWT, {expiresIn: '10m'})

        const refreshToken = jwt.sign({
            userId: userId,
            deviceId: deviceId,
            lastActiveDate: date
        }, settings.SECRET_REFRESH, {expiresIn: '20m'})

        return {
            accessToken: {
                accessToken: token
            },
            refreshToken: refreshToken
        }
    }

    async logout(deviceId: string){
        return await sessionsRepository.logoutSession(deviceId)
    }

    async deleteAllSessions(userId: ObjectId, deviceId: string) {
        return await sessionsRepository.deleteAllSessions(userId, deviceId)
    }
    async deleteSession(userId: ObjectId, deviceId: string): Promise<RESPONSE_OPTIONS>{
        const session: DeviceAuthSessionType|null = await usersQueryRepository.findDeviceSession(deviceId)
        if(!session) return RESPONSE_OPTIONS.NOT_FOUND

        if(userId.toString() !== session.userId.toString() ) {
            return RESPONSE_OPTIONS.FORBIDDEN
        }

        await sessionsRepository.deleteSession(deviceId)
        return RESPONSE_OPTIONS.NO_CONTENT

    }

}


export const jwtService = new JwtService()