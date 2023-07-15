import {ObjectId} from "mongodb";
import {UsersRepository} from "../repositories/users-repository";
import {RESPONSE_OPTIONS} from "../types/res-status";
import {SessionsRepository} from "../repositories/sessions-repository";
import {DeviceAuthSessionType} from "../db/db-users-type";
import {JwtAdapter} from "../adapters/jwt-adapter";


export class JwtService {


    constructor(protected sessionsRepository: SessionsRepository,
                protected usersRepository: UsersRepository,
                protected jwtAdapter: JwtAdapter) {
    }


    async createJWT(userId: ObjectId, ip: string, deviceName = "Chrome") {

        const dateForSessions = new Date()
        const expDate = await this.jwtAdapter.createExpDate(dateForSessions)
        const deviceId = await this.jwtAdapter.createId()

        const bothTokens = await this._createTokens(userId, deviceId, dateForSessions)

        const DevicesAuthSessions: DeviceAuthSessionType = new DeviceAuthSessionType(
            new ObjectId(),
            userId,
            ip,
            deviceName,
            dateForSessions,
            expDate,
            deviceId,
        )

        await this.sessionsRepository.createDeviceSession(DevicesAuthSessions)

        return bothTokens
    }

    async getUserIdByToken(token: string) {
        try {
            const result: any = await this.jwtAdapter.verifyAccessToken(token)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }

    }

    async verifyRefreshToken(refreshToken: string) {
        try {
            const tokenIsVerified: any = await this.jwtAdapter.verifyRefreshToken(refreshToken)
            const deviceSession = await this.sessionsRepository.findDeviceSession(tokenIsVerified.deviceId, tokenIsVerified.lastActiveDate)
            if (!deviceSession) {
                return null
            }
            return tokenIsVerified
        } catch (error) {
            return null
        }
    }

    async newTokens(userId: ObjectId, deviceId: string) {
        const newDate = new Date()
        const tokens = this._createTokens(userId, deviceId, newDate)
        await this.sessionsRepository.updateDate(deviceId, newDate)
        return tokens

    }

    async _createTokens(userId: ObjectId, deviceId: string, date: Date) {

        const token = await this.jwtAdapter.signAccessToken(userId)

        const refreshToken = await this.jwtAdapter.signRefreshToken(userId, deviceId, date)

        return {
            accessToken: {
                accessToken: token
            },
            refreshToken: refreshToken
        }
    }

    async logout(deviceId: string) {
        return await this.sessionsRepository.logoutSession(deviceId)
    }

    async deleteAllSessions(userId: ObjectId, deviceId: string) {
        return await this.sessionsRepository.deleteAllSessions(userId, deviceId)
    }

    async deleteSession(userId: ObjectId, deviceId: string): Promise<RESPONSE_OPTIONS> {
        const session: DeviceAuthSessionType | null = await this.sessionsRepository.findDeviceSession(deviceId)
        if (!session) return RESPONSE_OPTIONS.NOT_FOUND

        if (userId.toString() !== session.userId.toString()) {
            return RESPONSE_OPTIONS.FORBIDDEN
        }

        await this.sessionsRepository.deleteSession(deviceId)
        return RESPONSE_OPTIONS.NO_CONTENT

    }

}

