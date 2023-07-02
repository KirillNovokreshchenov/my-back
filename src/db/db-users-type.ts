import {ObjectId, WithId} from "mongodb";
import {UserViewModel} from "../models/user-models/UserViewModel";
import {Model} from "mongoose";

export type UserType = WithId<{
    login: string
    email: string
    password: string
    createdAt: string
}>

export type EmailConfirmationType = {
    userId: ObjectId
    email: string
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export type PasswordRecoveryType = {
    email: string
    recoveryCode: string
    expirationDate: Date
}

export type EmailTypeDB = EmailConfirmationType|PasswordRecoveryType

export type CodeRecoveryPassword = {
    newPassword: string,
    recoveryCode: string
}

export type CodeConfirmationEmail = {
    code: string
}

export type EmailType = {
    email: string
}

export type DeviceAuthSession = {
    userId: ObjectId
    ip: string
    title: string
    lastActiveDate: Date
    expDate: Date
    deviceId: string
}

export type RateLimit = {
    ip: string
    url: string
    date: Date
}