import mongoose from "mongoose";

import {PasswordRecoveryType} from "../db/db-email-type";
import {EmailConfirmationType} from "../db/db-users-type";





export const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: Boolean
})



const PasswordRecoverySchema = new mongoose.Schema<PasswordRecoveryType>({
    email: String,
    recoveryCode: String,
    expirationDate: Date
})

export const PasswordRecoveryClass = mongoose.model('PasswordRecovery', PasswordRecoverySchema, 'EmailCollection')