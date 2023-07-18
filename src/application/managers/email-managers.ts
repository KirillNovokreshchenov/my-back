import {EmailAdapter} from "../../infrastructure/adapters/email-adapter";
import {PasswordRecoveryType} from "../../db/db-email-type";
import {inject, injectable} from "inversify";
import {EmailConfirmationType, UserType} from "../../db/db-users-type";

@injectable()
export class EmailManagers {
    constructor(@inject(EmailAdapter)protected emailAdapter: EmailAdapter) {
    }
    async emailRegistration(user: UserType) {

        const emailUser = user.email

        const subject = 'Complete registration'

        const htmlMessages =
            `<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
       </p>`

        await this.emailAdapter.sendEmail(emailUser, subject, htmlMessages)


    }
    async passwordRecovery({email, recoveryCode}: PasswordRecoveryType) {
        const emailUser = email

        const subject = 'Password recovery'

        const htmlMessages =
            `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`

        await this.emailAdapter.sendEmail(emailUser, subject, htmlMessages)


    }

}