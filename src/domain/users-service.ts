import {CreateUserInputModel} from "../models/user-models/CreateUserInputModel";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users-repository";
import {LoginModel} from "../models/auth-models/LoginModel";
import {UserType} from "../db/db-users-type";

export const usersService = {
    async createUser({login, email, password}: CreateUserInputModel): Promise<ObjectId> {
        const passwordHash = await this._generateHash(password)
        const newUser: UserType = {
            _id: new ObjectId(),
            login: login,
            email,
            password: passwordHash,
            createdAt: new Date().toISOString()
        }
        return usersRepository.createUser(newUser)
    },

    async deleteUser(id: string) {
        return await usersRepository.deleteUser(id)
    },

    async checkCredentials({loginOrEmail, password}: LoginModel): Promise<false|ObjectId> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid) return false
        return user._id

    },

    async _generateHash(password: string) {
        return bcrypt.hash(password, 10)
    }

}