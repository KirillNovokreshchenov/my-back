
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
