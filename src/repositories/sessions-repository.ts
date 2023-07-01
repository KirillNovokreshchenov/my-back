import {DeviceAuthSession} from "../db/db-users-type";
import {collectionDevicesAuthSessions} from "../db/db";
import {ObjectId} from "mongodb";


export const sessionsRepository = {

    async createDeviceSession(authSession: DeviceAuthSession) {
        await collectionDevicesAuthSessions.insertOne(authSession)
    },

    async updateDate(deviceId: string, date: Date) {
        await collectionDevicesAuthSessions.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: date}})
    },

    async logoutSession(deviceId: string) {
        const result = await collectionDevicesAuthSessions.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    },

    async deleteAllSessions(userId: ObjectId, deviceId: string){
        await collectionDevicesAuthSessions.deleteMany({$and: [{userId: userId}, {deviceId: {$ne: deviceId}}]})
        const count = await collectionDevicesAuthSessions.countDocuments({userId: userId})
        return count === 1
    },

    async deleteSession(deviceId: string){
        const result = await collectionDevicesAuthSessions.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    }
}