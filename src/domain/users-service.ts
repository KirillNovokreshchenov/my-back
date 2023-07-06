import {UserInputModel} from "../models/user-models/UserInputModel";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users-repository";
import {LoginModel} from "../models/auth-models/LoginModel";
import {EmailConfirmationType, PasswordRecoveryType, UserType} from "../db/db-users-type";
import {uuid} from "uuidv4";
import {add} from 'date-fns'
import {emailManagers} from "../managers/email-managers";
import {usersQueryRepository} from "../repositories/query-users-repository";
import {UserModelClass} from "../db/schemas/schema-user";
import {HydratedDocument} from "mongoose";
import {collectionEmail} from "../db/db";


export const usersService = {
    async createUser(userData: UserInputModel): Promise<ObjectId> {
        const newUser: UserType = await this._newUser(userData)
        return usersRepository.createUser(newUser)
    },

    async createUserByRegistration(dataRegistration: UserInputModel): Promise<boolean> {

        const newUser: UserType = await this._newUser(dataRegistration)

        const userId = await usersRepository.createUser(newUser)

        if (!userId) return false

        const newEmailConfirmation: EmailConfirmationType = await this._createEmailConfirmation(userId, newUser.email)

        await usersRepository.emailConfirmation(newEmailConfirmation)

        try {
            await emailManagers.emailRegistration(newEmailConfirmation)
            return true
        } catch (e) {
            console.log(e)
            await usersRepository.deleteUser(userId.toString())
            await usersRepository.deleteEmailConfirmation(userId)
            return false
        }


    },

    async deleteUser(id: string) {
        return await usersRepository.deleteUser(id)
    },

    async checkCredentials({loginOrEmail, password}: LoginModel): Promise<false | ObjectId> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return false
        return user._id

    },

    async confirmEmail(code: string): Promise<boolean> {
        const codeIsExisting = await usersQueryRepository.getEmailConfirmation(code)
        if (!codeIsExisting) return false
        if (codeIsExisting.expirationDate < new Date()) return false
        if (codeIsExisting.isConfirmed) return false
        return usersRepository.updateConfirm(code)
    },

    async emailResending(email: string): Promise<boolean> {
        const emailConfirmation = await usersQueryRepository.getEmailConfirmation(email)
        if (!emailConfirmation) return false
        if (emailConfirmation.isConfirmed) return false

        const newCode = uuid()
        const newDate = add(new Date(), {
            hours: 1
        })

        try {
            await usersRepository.updateEmailConfirmationCode(emailConfirmation.userId, newCode, newDate)
            await emailManagers.emailRegistration({...emailConfirmation, confirmationCode: newCode})
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    },

    async recoveryPassword(email: string) {
        const recoveryCode = uuid()
        const date = add(new Date(), {
            hours: 1
        })
        const recoveryPassword: PasswordRecoveryType = {
            email: email,
            recoveryCode: recoveryCode,
            expirationDate: date
        }

        try {
            await emailManagers.passwordRecovery(recoveryPassword)
        } catch {
            return
        }
        await usersRepository.emailRecoveryPassword(recoveryPassword)

    },

    async newPassword(newPassword: string, recoveryCode: string): Promise<boolean> {

        const recoveryData = await usersQueryRepository.getRecoveryData(recoveryCode)

        if (!recoveryData) return false
        if (recoveryData.expirationDate < new Date()) return false

        const newPasswordCreated = await this._generateHash(newPassword)

        const updatePassword = await usersRepository.newPassword(newPasswordCreated, recoveryData.email)

        return updatePassword;




    },


    async _generateHash(password: string) {
        return bcrypt.hash(password, 10)
    },

    async _newUser({login, email, password}: UserInputModel) {
        const passwordHash = await this._generateHash(password)
        const newUser: UserType = {
            _id: new ObjectId(),
            login: login,
            email,
            password: passwordHash,
            createdAt: new Date().toISOString()
        }
        return newUser
    },

     _createEmailConfirmation(userId: ObjectId, email: string): EmailConfirmationType {
        return {
            userId: userId,
            email: email,
            confirmationCode: uuid(),
            expirationDate: add(new Date(), {
                hours: 1
            }),
            isConfirmed: false
        }
    }


}