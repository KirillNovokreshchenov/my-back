import {ObjectId} from "mongodb";

// export type EmailConfirmationType = WithId<{
//     userId: ObjectId
//     email: string
//     confirmationCode: string
//     expirationDate: Date
//     isConfirmed: boolean
// }>



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




