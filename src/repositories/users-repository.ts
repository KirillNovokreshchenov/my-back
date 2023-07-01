import {ObjectId} from "mongodb";
import {
    collectionDevicesAuthSessions,
    collectionEmailConfirmations,
    collectionUsers
} from "../db/db";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {DeviceAuthSession, EmailConfirmationType, UserType} from "../db/db-users-type";
import {UserModelClass} from "../db/schemas/schema-user";

export const usersRepository = {
    async createUser(newUser: UserType): Promise<ObjectId> {
        await UserModelClass.create(newUser)
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
        return collectionEmailConfirmations.findOne({confirmationCode: code})
    },
    async updateConfirm(code: string) {
        const result = await collectionEmailConfirmations.updateOne({confirmationCode: code}, {$set: {isConfirmed: true}})
        return result.matchedCount === 1
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
    }


}