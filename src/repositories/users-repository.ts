import {ObjectId} from "mongodb";
import {collectionUsers} from "../db/db";
import {formatIdInObjectId} from "../helpers/format-id-ObjectId";
import {UserType} from "../db/db-users-type";

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
    }
}