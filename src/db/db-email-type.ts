import {ObjectId, WithId} from "mongodb";

// export type EmailConfirmationType = WithId<{
//     userId: ObjectId
//     email: string
//     confirmationCode: string
//     expirationDate: Date
//     isConfirmed: boolean
// }>

export class EmailConfirmationType {
    constructor(
        public _id: ObjectId,
        public userId: ObjectId,
        public email: string,
        public confirmationCode: string,
        public expirationDate: Date,
        public isConfirmed: boolean
    ) {
    }

}

export class PasswordRecoveryType {
    constructor(
        public _id: ObjectId,
        public email: string,
        public recoveryCode: string,
        public expirationDate: Date
    ) {
    }
}

//
// export type PasswordRecoveryType = WithId<{
//     email: string
//     recoveryCode: string
//     expirationDate: Date
// }>




