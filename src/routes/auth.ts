import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {LoginModel} from "../models/auth-models/LoginModel";
import {usersService} from "../domain/users-service";
import {loginValidation} from "../middlewares/login-middleware";
import {jwtService} from "../application/jwt-service";
import {jwtMiddleware} from "../middlewares/auth-jwt-middleware";
import {usersQueryRepository} from "../repositories/query-users-repository";
import {JWTtokenViewModel} from "../models/auth-models/JWTtokenViewModel";
import {DataViewByToken} from "../models/auth-models/DataViewByToken";
import {UserInputModel} from "../models/user-models/UserInputModel";
import {
    codeConfirmationValidation,
    emailValidationResending, newPasswordValidation,
    userValidationByRegistration
} from "../middlewares/user-middleware";
import {errorsValidationMiddleware} from "../middlewares/err-middleware";
import {jwtRefreshMiddleware} from "../middlewares/auth-refresh-middleware";
import {RESPONSE_STATUS} from "../types/res-status";
import {rateLimitsMiddleware} from "../middlewares/rateLimits-middleware";
import {CodeConfirmationEmail, CodeRecoveryPassword, EmailType} from "../models/email-models/EmailModels";



export const authRouter = Router()

authRouter.post('/login',
    loginValidation,
    async (req: RequestWithBody<LoginModel>, res: Response<JWTtokenViewModel>) => {
        const userId = await usersService.checkCredentials(req.body)
        if (userId) {
            const tokens = await jwtService.createJWT(userId, req.ip, req.headers['user-agent'])

            res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
            res.status(RESPONSE_STATUS.OK_200).send(tokens.accessToken)

        } else {
            res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
        }
    })

authRouter.post('/refresh-token',
    jwtRefreshMiddleware,
    async (req: Request, res: Response<JWTtokenViewModel>) => {

        const tokens = await jwtService.newTokens(req.user!._id, req.deviceId)
        res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
        res.status(200).send(tokens.accessToken)

    })

authRouter.post('/logout',
    jwtRefreshMiddleware,
    async (req: Request, res: Response) => {
        const logout = await jwtService.logout(req.deviceId)
        if (logout) {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(RESPONSE_STATUS.UNAUTHORIZED_401)
        }

    })


authRouter.get('/me',
    jwtMiddleware,
    async (req: Request, res: Response<DataViewByToken>) => {
        const user = await usersQueryRepository.findUserWithToken(req.user!._id)

        if (!user) {
            res.sendStatus(RESPONSE_STATUS.NOT_FOUND_404)
            return
        }

        res.status(RESPONSE_STATUS.OK_200).send(user)
    })

authRouter.post('/registration',
    userValidationByRegistration,
    async (req: RequestWithBody<UserInputModel>, res: Response) => {
        const newUser = await usersService.createUserByRegistration(req.body)
        if (!newUser) {
            res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
        } else {
            res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
        }

    })

authRouter.post('/registration-confirmation',
    rateLimitsMiddleware,
    codeConfirmationValidation,
    errorsValidationMiddleware,
    async (req: RequestWithBody<CodeConfirmationEmail>, res: Response) => {
        const codeIsConfirmed = await usersService.confirmEmail(req.body.code)
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
    })

authRouter.post('/registration-email-resending',
    rateLimitsMiddleware,
    emailValidationResending,
    errorsValidationMiddleware,
    async (req: RequestWithBody<EmailType>, res: Response) => {
        const emailResending = await usersService.emailResending(req.body.email)
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
    })


authRouter.post('/password-recovery',
    rateLimitsMiddleware,
    emailValidationResending,
    errorsValidationMiddleware,
    async (req: RequestWithBody<EmailType>, res: Response) => {
        try {
            await usersService.recoveryPassword(req.body.email)
        } catch {
            return res.sendStatus(RESPONSE_STATUS.SERVER_ERROR_500)
        }


        return res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)

    })

authRouter.post('/new-password',
    rateLimitsMiddleware,
    newPasswordValidation,
    errorsValidationMiddleware,
    async (req: RequestWithBody<CodeRecoveryPassword>, res: Response) => {

        try {
            const newPassword = await usersService.newPassword(req.body.newPassword, req.body.recoveryCode)
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
)