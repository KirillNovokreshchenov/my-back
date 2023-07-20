import {ObjectId} from "mongodb";





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


export class RateLimitType {
    constructor(
        public ip: string,
        public url: string,
       public date: Date
    ) {
    }
}

