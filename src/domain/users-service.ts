import {CreateUserInputModel} from "../models/user-models/CreateUserInputModel";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users-repository";
import {LoginModel} from "../models/auth-models/LoginModel";

export const usersService = {
    async createUser({login, email, password}: CreateUserInputModel): Promise<ObjectId> {
        const passwordHash = await this._generateHash(password)
        const newUser = {
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

    async checkCredentials({loginOrEmail, password}: LoginModel): Promise<boolean> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        return await bcrypt.compare(password, user!.password)

    },

    async _generateHash(password: string) {
        return bcrypt.hash(password, 10)
    }

}