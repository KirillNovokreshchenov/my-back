import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {LoginModel} from "../models/auth-models/LoginModel";
import {UsersService} from "../domain/users-service";
import {loginValidation} from "../middlewares/login-middleware";
import {JwtService} from "../application/jwt-service";
import {jwtMiddleware} from "../middlewares/auth-jwt-middleware";
import {UsersQueryRepository} from "../repositories/query-users-repository";
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

class AuthController {

    private usersService: UsersService
    private jwtService: JwtService
    private usersQueryRepository: UsersQueryRepository

    constructor() {
        this.jwtService = new JwtService()
        this.usersService = new UsersService()
        this.usersQueryRepository= new UsersQueryRepository()
    }

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

const authController = new AuthController()

authRouter.post('/login',
    loginValidation,
    authController.login.bind(authController))

authRouter.post('/refresh-token',
    jwtRefreshMiddleware,
    authController.refreshToken.bind(authController))

authRouter.post('/logout',
    jwtRefreshMiddleware,
    authController.logout.bind(authController))


authRouter.get('/me',
    jwtMiddleware,
    authController.me.bind(authController))

authRouter.post('/registration',
    userValidationByRegistration,
    authController.registration.bind(authController))

authRouter.post('/registration-confirmation',
    rateLimitsMiddleware,
    codeConfirmationValidation,
    errorsValidationMiddleware,
    authController.registrationConfirmation.bind(authController))

authRouter.post('/registration-email-resending',
    rateLimitsMiddleware,
    emailValidationResending,
    errorsValidationMiddleware,
    authController.registrationEmailResending.bind(authController))


authRouter.post('/password-recovery',
    rateLimitsMiddleware,
    emailValidationResending,
    errorsValidationMiddleware,
    authController.passwordRecovery.bind(authController))

authRouter.post('/new-password',
    rateLimitsMiddleware,
    newPasswordValidation,
    errorsValidationMiddleware,
    authController.newPassword.bind(authController)
)