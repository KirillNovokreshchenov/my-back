import {ObjectId} from "mongodb";
import {
    collectionEmail,
} from "../db/db";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {UserType} from "../db/db-users-type";
import {UserModelClass} from "../db/schemas/schema-user";
import {EmailConfirmationType, PasswordRecoveryType} from "../db/db-email-type";
import {EmailConfirmationClass, PasswordRecoveryClass} from "../db/schemas/schemas-email";

export class UsersRepository {
    async createUser(newUser: UserType): Promise<ObjectId> {
        await UserModelClass.create(newUser)
        return newUser._id
    }
    async deleteUser(id: string) {
        const result: any  = await UserModelClass.deleteOne({_id: formatIdInObjectId(id)})
        return result.deletedCount === 1
    }
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
        return UserModelClass.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    }


    async emailConfirmation(newEmailConfirmation: EmailConfirmationType) {
        await EmailConfirmationClass.create(newEmailConfirmation)

    }
    async codeConfirmation(code: string): Promise<EmailConfirmationType | null> {
        return collectionEmail.findOne({confirmationCode: code}) as Promise<EmailConfirmationType | null>
    }
    async updateConfirm(code: string): Promise<boolean> {
        const result: any  = await EmailConfirmationClass.updateOne({confirmationCode: code}, {$set: {isConfirmed: true}})
        return result.matchedCount === 1
    }
    async updateEmailConfirmationCode(id: ObjectId, newCode: string, date: Date): Promise<boolean> {
        const result: any  = await EmailConfirmationClass.updateOne({userId: id}, {
            $set: {
                confirmationCode: newCode,
                expirationDate: date
            }
        })
        return result.modifiedCount === 1
    }
    async deleteEmailConfirmation(userId: ObjectId): Promise<boolean> {
        const result: any  = await EmailConfirmationClass.deleteOne({userId: userId})
        return result.deletedCount === 1
    }

    async emailRecoveryPassword(recoveryPassword: PasswordRecoveryType) {
        await PasswordRecoveryClass.create(recoveryPassword)
    }

    async newPassword(newPassword: string, email: string): Promise<boolean> {
       const result: any = await UserModelClass.updateOne({email: email},{$set: {password: newPassword}})
        return result.modifiedCount === 1

    }

}

