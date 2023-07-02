import {ModifyResult, ObjectId} from "mongodb";
import {
    collectionDevicesAuthSessions,
    collectionEmail,
    collectionUsers
} from "../db/db";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {DeviceAuthSession, EmailConfirmationType, PasswordRecoveryType, UserType} from "../db/db-users-type";
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
        await collectionEmail.insertOne(newEmailConfirmation)

    },
    async codeConfirmation(code: string): Promise<EmailConfirmationType | null> {
        return collectionEmail.findOne({confirmationCode: code}) as Promise<EmailConfirmationType | null>
    },
    async updateConfirm(code: string): Promise<boolean> {
        const result = await collectionEmail.updateOne({confirmationCode: code}, {$set: {isConfirmed: true}})
        return result.matchedCount === 1
    },
    async updateEmailConfirmationCode(id: ObjectId, newCode: string, date: Date): Promise<boolean> {
        const result = await collectionEmail.updateOne({userId: id}, {
            $set: {
                confirmationCode: newCode,
                expirationDate: date
            }
        })
        return result.modifiedCount === 1
    },
    async deleteEmailConfirmation(userId: ObjectId): Promise<boolean> {
        const result = await collectionEmail.deleteOne({userId: userId})
        return result.deletedCount === 1
    },

    async emailRecoveryPassword(recoveryPassword: PasswordRecoveryType) {
        await collectionEmail.insertOne(recoveryPassword)
    },

    async newPassword(newPassword: string, email: string): Promise<boolean> {
       const result = await collectionUsers.updateOne({email: email},{$set: {password: newPassword}})
        return result.modifiedCount === 1

    }



}