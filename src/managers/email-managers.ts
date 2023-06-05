import {EmailConfirmationType} from "../db/db-users-type";
import {emailAdapter} from "../adapters/email-adapter";


export const emailManagers = {
    async emailRegistration({email, confirmationCode}: EmailConfirmationType) {
        const emailUser = email

        const subject = 'Complete registration'

        const htmlMessages =
            `<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
       </p>`

        await emailAdapter.sendEmail(emailUser, subject, htmlMessages)


    }
}