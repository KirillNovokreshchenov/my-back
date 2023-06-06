import {ObjectId} from "mongodb";
import {collectionEmailConfirmations, collectionUsers} from "../db/db";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {EmailConfirmationType, UserType} from "../db/db-users-type";

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

    async emailConfirmation(newEmailConfirmation: EmailConfirmationType){
        await collectionEmailConfirmations.insertOne(newEmailConfirmation)

    },
    async codeConfirmation(code: string): Promise<EmailConfirmationType|null>{
        return await collectionEmailConfirmations.findOne({confirmationCode: code})
    },
    async updateConfirm(code: string){
        const result = await collectionEmailConfirmations.updateOne({confirmationCode:code}, {$set:{isConfirmed: true}})
        return result.modifiedCount === 1
    },
    async updateEmailConfirmationCode(id: ObjectId, newCode: string){
        const result = await collectionEmailConfirmations.updateOne({userId: id}, {$set: {confirmationCode: newCode}})
        return result.modifiedCount === 1
    },
    async deleteEmailConfirmation(userId: ObjectId){
        const result = await collectionEmailConfirmations.deleteOne({userId: userId})
        return result.deletedCount === 1
    }

}