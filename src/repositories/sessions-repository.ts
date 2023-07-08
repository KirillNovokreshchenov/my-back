import {DeviceAuthSessionType} from "../db/db-users-type";
import {collectionDevicesAuthSessions} from "../db/db";
import {ObjectId} from "mongodb";
import {DeviceSessionModelClass} from "../db/schemas/shema-session";




class SessionsRepository {

    async createDeviceSession(authSession: DeviceAuthSessionType) {
        await DeviceSessionModelClass.create(authSession)
    }

    async updateDate(deviceId: string, date: Date) {
        await DeviceSessionModelClass.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: date}})
    }

    async logoutSession(deviceId: string) {
        const result = await DeviceSessionModelClass.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    }

    async deleteAllSessions(userId: ObjectId, deviceId: string){
        await DeviceSessionModelClass.deleteMany({$and: [{userId: userId}, {deviceId: {$ne: deviceId}}]})
        const count = await DeviceSessionModelClass.countDocuments({userId: userId})
        return count === 1
    }

    async deleteSession(deviceId: string){
        const result = await DeviceSessionModelClass.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    }
}

export const sessionsRepository = new SessionsRepository()