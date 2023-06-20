import {ObjectId} from "mongodb";
import {
    collectionDevicesAuthSessions,
    collectionEmailConfirmations,
    collectionUsers
} from "../db/db";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {DeviceAuthSession, EmailConfirmationType, UserType} from "../db/db-users-type";

export const usersRepository = {
    async createUser(newUser: UserType): Promise<ObjectId> {
        await collectionUsers.insertOne(newUser)
        return newUser._id
    },
    async deleteUser(id: string) {
        const result = await collectionUsers.deleteOne({_id: formatIdInObjectId(id)})
        return result.deletedCount === 1
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
        return await collectionUsers.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    },


    async emailConfirmation(newEmailConfirmation: EmailConfirmationType) {
        await collectionEmailConfirmations.insertOne(newEmailConfirmation)

    },
    async codeConfirmation(code: string): Promise<EmailConfirmationType | null> {
        return await collectionEmailConfirmations.findOne({confirmationCode: code})
    },
    async updateConfirm(code: string) {
        const result = await collectionEmailConfirmations.updateOne({confirmationCode: code}, {$set: {isConfirmed: true}})
        return result.modifiedCount === 1
    },
    async updateEmailConfirmationCode(id: ObjectId, newCode: string, date: Date) {
        const result = await collectionEmailConfirmations.updateOne({userId: id}, {
            $set: {
                confirmationCode: newCode,
                expirationDate: date
            }
        })
        return result.modifiedCount === 1
    },
    async deleteEmailConfirmation(userId: ObjectId) {
        const result = await collectionEmailConfirmations.deleteOne({userId: userId})
        return result.deletedCount === 1
    },

    async createDeviceSession(authSession: DeviceAuthSession) {
        await collectionDevicesAuthSessions.insertOne(authSession)
    },

    // async blackListRefreshToken(refreshToken: RefreshTokenType) {
    //     await collectionRefreshTokens.insertOne(refreshToken)
    // },

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