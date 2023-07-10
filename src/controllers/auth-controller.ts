import {UsersService} from "../domain/users-service";
import {JwtService} from "../application/jwt-service";
import {UsersQueryRepository} from "../repositories/query-users-repository";
import {RequestWithBody} from "../types/types";
import {LoginModel} from "../models/auth-models/LoginModel";
import {Request, Response} from "express";
import {JWTtokenViewModel} from "../models/auth-models/JWTtokenViewModel";
import {RESPONSE_STATUS} from "../types/res-status";
import {DataViewByToken} from "../models/auth-models/DataViewByToken";
import {UserInputModel} from "../models/user-models/UserInputModel";
import {CodeConfirmationEmail, CodeRecoveryPassword, EmailType} from "../models/email-models/EmailModels";


export class AuthController {
    constructor(protected usersService: UsersService,
                protected jwtService: JwtService,
                protected usersQueryRepository: UsersQueryRepository) { }

    async login(req: RequestWithBody<LoginModel>, res: Response<JWTtokenViewModel>) {
        const userId = await this.usersService.checkCredentials(req.body)
        if (userId) {
            const tokens = await this.jwtService.createJWT(userId, req.ip, req.headers['user-agent'])

            res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
            res.status(RESPONSE_STATUS.OK_200).send(tokens.accessToken)

        } else {
            res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
        }
    }

    async refreshToken(req: Request, res: Response<JWTtokenViewModel>) {

        const tokens = await this.jwtService.newTokens(req.user!._id, req.deviceId)
        res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
        res.status(200).send(tokens.accessToken)

    }

    async logout(req: Request, res: Response) {
        const logout = await this.jwtService.logout(req.deviceId)
        if (logout) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
        }
    }

    async me(req: Request, res: Response<DataViewByToken>) {
        const user = await this.usersQueryRepository.findUserWithToken(req.user!._id)

        if (!user) {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
            return
        }

        res.status(RESPONSE_STATUS.OK_200).send(user)
    }

    async registration(req: RequestWithBody<UserInputModel>, res: Response) {
        const newUser = await this.usersService.createUserByRegistration(req.body)
        if (!newUser) {
            res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
        } else {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        }
    }

    async registrationConfirmation(req: RequestWithBody<CodeConfirmationEmail>, res: Response) {
        const codeIsConfirmed = await this.usersService.confirmEmail(req.body.code)
        if (!codeIsConfirmed) {
            res.status(RESPONSE_STATUS.BAD_REQUEST_400).send({
                "errorsMessages": [
                    {
                        "message": "string",
                        "field": "code"
                    }
                ]
            })
        } else {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        }
    }

    async registrationEmailResending(req: RequestWithBody<EmailType>, res: Response) {
        const emailResending = await this.usersService.emailResending(req.body.email)
        if (!emailResending) {
            res.status(RESPONSE_STATUS.BAD_REQUEST_400).send({
                "errorsMessages": [
                    {
                        "message": "string",
                        "field": "email"
                    }
                ]
            })
        } else {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        }
    }

    async passwordRecovery(req: RequestWithBody<EmailType>, res: Response) {

        try {
            await this.usersService.recoveryPassword(req.body.email)
        } catch {
            return res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
        }
        return res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)

    }

    async newPassword(req: RequestWithBody<CodeRecoveryPassword>, res: Response) {
        try {
            const newPassword = await this.usersService.newPassword(req.body.newPassword, req.body.recoveryCode)
            if (newPassword) {
                res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
            } else {
                res.status(RESPONSE_STATUS.BAD_REQUEST_400).send({
                    "errorsMessages": [
                        {
                            "message": "string",
                            "field": "recoveryCode"
                        }
                    ]
                })
            }

        } catch {
            res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
        }

    }

}