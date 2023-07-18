import {UserInputModel} from "../models/user-models/UserInputModel";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'
import {UsersRepository} from "../infrastructure/repositories/users-repository";
import {LoginModel} from "../models/auth-models/LoginModel";
import {EmailConfirmationType, UserType} from "../db/db-users-type";
import {uuid} from "uuidv4";
import {add} from 'date-fns'
import {EmailManagers} from "./managers/email-managers";
import {PasswordRecoveryType} from "../db/db-email-type";
import {inject, injectable} from "inversify";
import {UserMethods, UserModelClass} from "../domain/schema-user";
import mongoose, {HydratedDocument} from "mongoose";


@injectable()
export class UsersService {

    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(EmailManagers) protected emailManagers: EmailManagers) {
    }


    async createUserByAdmin(userData: UserInputModel): Promise<ObjectId> {

        const newUser: HydratedDocument<UserType, UserMethods> = await UserModelClass.constructUser(userData.login, userData.email, userData.password)
        newUser.confirm()
        await this.usersRepository.saveUser(newUser)
        return newUser._id
    }

    async createUserByRegistration(dataRegistration: UserInputModel): Promise<boolean> {

        const newUser = await UserModelClass.constructUser(dataRegistration.login, dataRegistration.email, dataRegistration.password)

        try {
            await this.emailManagers.emailRegistration(newUser)
        } catch {
            return false
        }
        await this.usersRepository.saveUser(newUser)
        return true
    }

    async deleteUser(id: string) {
        return await this.usersRepository.deleteUser(id)
    }

    async checkCredentials({loginOrEmail, password}: LoginModel): Promise<ObjectId | false> {
        const user: HydratedDocument<UserType, UserMethods>|null = await this.usersRepository.findUser(loginOrEmail)

        if (!user) return false

        const isValid = await user.compareHash(password, user.password)

        if (!isValid) return false

        return user._id

    }

    async confirmEmail(code: string): Promise<boolean> {
        const user = await this.usersRepository.findUser(code)
        if (!user) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        if (user.emailConfirmation.isConfirmed) return false
        user.emailConfirmation.isConfirmed = true
        await this.usersRepository.saveUser(user)
        return true
    }

    async emailResending(email: string): Promise<boolean> {
        const userModel = await this.usersRepository.findUser(email)
        if (!userModel) return false
        if (userModel.emailConfirmation.isConfirmed) return false

        userModel.emailConfirmation.confirmationCode = uuid()
        userModel.emailConfirmation.expirationDate = add(new Date(), {
            hours: 1
        })

        try {
            // await this.usersRepository.upda teEmailConfirmationCode(emailConfirmation.userId, newCode, newDate)
            await this.emailManagers.emailRegistration(userModel)
        } catch {
            return false
        }
        await this.usersRepository.saveUser(userModel)
        return true
    }

    async recoveryPassword(email: string) {
        const recoveryCode = uuid()
        const date = add(new Date(), {
            hours: 1
        })
        const recoveryPassword: PasswordRecoveryType = new PasswordRecoveryType(
            new ObjectId(),
            email,
            recoveryCode,
            date
        )

        try {
            await this.emailManagers.passwordRecovery(recoveryPassword)
        } catch {
            return
        }
        await this.usersRepository.emailRecoveryPassword(recoveryPassword)

    }

    async newPassword(newPassword: string, recoveryCode: string): Promise<boolean> {

        const recoveryData = await this.usersRepository.getRecoveryData(recoveryCode)

        if (!recoveryData) return false
        if (recoveryData.expirationDate < new Date()) return false

        const newPasswordCreated = await this._generateHash(newPassword)

        return this.usersRepository.newPassword(newPasswordCreated, recoveryData.email);


    }


    async _generateHash(password: string) {
        return bcrypt.hash(password, 10)
    }

    async _newUser({login, email, password}: UserInputModel) {
        const passwordHash = await this._generateHash(password)
        const newUser = new UserType(
            new mongoose.Types.ObjectId(),
            login,
            email,
            passwordHash,
            new Date().toISOString(),
            {
                confirmationCode: uuid(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: false
            }
        )
        return newUser
    }
}

