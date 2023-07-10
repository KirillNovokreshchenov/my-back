import {UserInputModel} from "../models/user-models/UserInputModel";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'
import {UsersRepository} from "../repositories/users-repository";
import {LoginModel} from "../models/auth-models/LoginModel";
import {UserType} from "../db/db-users-type";
import {uuid} from "uuidv4";
import {add} from 'date-fns'
import {EmailManagers} from "../managers/email-managers";
import {UsersQueryRepository} from "../repositories/query-users-repository";

import {EmailConfirmationType, PasswordRecoveryType} from "../db/db-email-type";


export class UsersService {

    constructor(
        protected usersRepository: UsersRepository,
        protected usersQueryRepository: UsersQueryRepository,
        protected emailManagers: EmailManagers) {
    }


    async createUser(userData: UserInputModel): Promise<ObjectId> {
        const newUser: UserType = await this._newUser(userData)
        return this.usersRepository.createUser(newUser)
    }

    async createUserByRegistration(dataRegistration: UserInputModel): Promise<boolean> {

        const newUser: UserType = await this._newUser(dataRegistration)

        const userId = await this.usersRepository.createUser(newUser)

        if (!userId) return false

        const newEmailConfirmation: EmailConfirmationType = await this._createEmailConfirmation(userId, newUser.email)

        await this.usersRepository.emailConfirmation(newEmailConfirmation)

        try {
            await this.emailManagers.emailRegistration(newEmailConfirmation)
            return true
        } catch (e) {
            console.log(e)
            await this.usersRepository.deleteUser(userId.toString())
            await this.usersRepository.deleteEmailConfirmation(userId)
            return false
        }


    }

    async deleteUser(id: string) {
        return await this.usersRepository.deleteUser(id)
    }

    async checkCredentials({loginOrEmail, password}: LoginModel): Promise<false | ObjectId> {
        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return false
        return user._id

    }

    async confirmEmail(code: string): Promise<boolean> {
        const codeIsExisting = await this.usersQueryRepository.getEmailConfirmation(code)
        if (!codeIsExisting) return false
        if (codeIsExisting.expirationDate < new Date()) return false
        if (codeIsExisting.isConfirmed) return false
        return this.usersRepository.updateConfirm(code)
    }

    async emailResending(email: string): Promise<boolean> {
        const emailConfirmation = await this.usersQueryRepository.getEmailConfirmation(email)
        if (!emailConfirmation) return false
        if (emailConfirmation.isConfirmed) return false

        const newCode = uuid()
        const newDate = add(new Date(), {
            hours: 1
        })

        try {
            await this.usersRepository.updateEmailConfirmationCode(emailConfirmation.userId, newCode, newDate)
            await this.emailManagers.emailRegistration({...emailConfirmation, confirmationCode: newCode})
            return true
        } catch (e) {
            console.log(e)
            return false
        }
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

        const recoveryData = await this.usersQueryRepository.getRecoveryData(recoveryCode)

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
        return new UserType(
            new ObjectId(),
            login,
            email,
            passwordHash,
            new Date().toISOString()
        )
    }

    _createEmailConfirmation(userId: ObjectId, email: string): EmailConfirmationType {
        return new EmailConfirmationType(
            new ObjectId(),
            userId,
            email,
            uuid(),
            add(new Date(), {
                hours: 1
            }),
            false)
    }


}

