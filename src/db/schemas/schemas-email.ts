import mongoose from "mongoose";
import {uuid} from "uuidv4";
import {add} from "date-fns";
import {EmailConfirmationType, PasswordRecoveryType} from "../db-email-type";


const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    userId: mongoose.Types.ObjectId,
    email: String,
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: Boolean
})


export const EmailConfirmationClass = mongoose.model('EmailConfirmation', EmailConfirmationSchema, 'EmailCollection')

const PasswordRecoverySchema = new mongoose.Schema<PasswordRecoveryType>({
    email: String,
    recoveryCode: String,
    expirationDate: Date
})

export const PasswordRecoveryClass = mongoose.model('PasswordRecovery', PasswordRecoverySchema, 'EmailCollection')