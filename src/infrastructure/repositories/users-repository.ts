import {ObjectId} from "mongodb";
import {formatIdInObjectId} from "../../helpers/format-id-ObjectId";
import {EmailConfirmationType, UserType} from "../../db/db-users-type";
import {UserModelClass} from "../../domain/schema-user";
import {PasswordRecoveryType} from "../../db/db-email-type";
import {PasswordRecoveryClass} from "../../domain/schemas-email";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {
    async findUser(codeOrEmail: string): Promise<UserType | null> {
        return UserModelClass.findOne({$or: [{email: codeOrEmail}, {"emailConfirmation.confirmationCode": codeOrEmail}]})

    }

    async createUser(newUserDTO: UserType): Promise<ObjectId> {
        const user = new UserModelClass(newUserDTO)
        await user.save()
        return user._id
    }

    async deleteUser(id: string) {
        const result: any = await UserModelClass.deleteOne({_id: formatIdInObjectId(id)})
        return result.deletedCount === 1
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
        return UserModelClass.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    }


    // async updateConfirm(code: string): Promise<boolean> {
    //     const result: any  = await UserModelClass.updateOne({"emailConfirmation.confirmationCode": code}, {$set: {isConfirmed: true}})
    //     return result.matchedCount === 1
    // }
    // async updateEmailConfirmationCode(id: ObjectId, newCode: string, date: Date): Promise<boolean> {
    //     const result: any  = await EmailConfirmationClass.updateOne({userId: id}, {
    //         $set: {
    //             confirmationCode: newCode,
    //             expirationDate: date
    //         }
    //     })
    //     return result.modifiedCount === 1
    // }
    // async deleteEmailConfirmation(userId: ObjectId): Promise<boolean> {
    //     const result: any  = await EmailConfirmationClass.deleteOne({userId: userId})
    //     return result.deletedCount === 1
    // }

    async emailRecoveryPassword(recoveryPassword: PasswordRecoveryType) {
        await PasswordRecoveryClass.create(recoveryPassword)
    }

    async newPassword(newPassword: string, email: string): Promise<boolean> {
        const result: any = await UserModelClass.updateOne({email: email}, {$set: {password: newPassword}})
        return result.modifiedCount === 1

    }

    // async getEmailConfirmation(emailOrCode: string): Promise<EmailConfirmationType | null> {
    //     return EmailConfirmationClass.findOne({$or: [{email: emailOrCode}, {confirmationCode: emailOrCode}]})
    // }

    async getRecoveryData(recoveryCode: string): Promise<PasswordRecoveryType | null> {
        return PasswordRecoveryClass.findOne({recoveryCode})
    }

    async saveUser(model: any) {
        await model.save()

    }
}

