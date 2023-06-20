import {ObjectId} from "mongodb";

export type UserType = {
    _id: ObjectId
    login: string
    email: string
    password: string
    createdAt: string
}

export type EmailConfirmationType = {
    userId: ObjectId
    email: string
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export type CodeConfirmation = {
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