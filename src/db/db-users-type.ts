import {ObjectId} from "mongodb";
import {Types} from "mongoose";



// export class EmailConfirmationType {
//     constructor(
//         public _id: ObjectId,
//         public userId: ObjectId,
//         public email: string,
//         public confirmationCode: string,
//         public expirationDate: Date,
//         public isConfirmed: boolean
//     ) {
//     }
//
// }
export type EmailConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export class UserType{
    constructor(
        public _id: ObjectId,
        public login: string,
        public email: string,
        public password: string,
        public createdAt: string,
        public emailConfirmation: EmailConfirmationType
    ) {
    }
}
// export interface UserDoc extends Document {
//     _id:  Types.ObjectId,
//     login: string,
//     email: string,
//     password: string,
//     createdAt: string,
//     emailConfirmation: EmailConfirmationType
// }

// export type UserType = WithId<{
//     login: string
//     email: string
//     password: string
//     createdAt: string
// }>

export class DeviceAuthSessionType {
    constructor(
        public _id: ObjectId,
        public userId: ObjectId,
        public ip: string,
        public title: string,
        public lastActiveDate: Date,
        public expDate: Date,
        public deviceId: string,
    ) {
    }
}

// export type DeviceAuthSessionType = {
//     userId: ObjectId
//     ip: string
//     title: string
//     lastActiveDate: Date
//     expDate: Date
//     deviceId: string
// }
export class RateLimitType {
    constructor(
        public ip: string,
        public url: string,
       public date: Date
    ) {
    }
}

// export type RateLimitType = {
//     ip: string
//     url: string
//     date: Date
// }