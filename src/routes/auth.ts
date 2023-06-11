import {Request, Response, Router} from "express";
import {RequestWithBody, RequestWithQuery} from "../types/types";
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
    emailValidationResending,
    userValidationByRegistration
} from "../middlewares/user-middleware";
import {CodeConfirmation, EmailType} from "../db/db-users-type";
import {errorsValidationMiddleware} from "../middlewares/err-middleware";
import {jwtRefreshMiddleware} from "../middlewares/auth-refresh-middleware";


export const authRouter = Router()

authRouter.post('/login',
    loginValidation,
    async (req: RequestWithBody<LoginModel>, res: Response<JWTtokenViewModel>) => {
        const userId = await usersService.checkCredentials(req.body)
        if (userId) {
            const tokens = await jwtService.createJWT(userId)
            res.cookie('refreshJWT', tokens.refreshToken, {httpOnly: true, secure: true})
            res.status(200).send(tokens.accessToken)
        } else {
            res.sendStatus(401)
        }
    })

authRouter.post('/refresh-token',
    jwtRefreshMiddleware,
    async (req: Request, res: Response<JWTtokenViewModel>) => {
        const refreshToken = req.cookies.refreshJWT

        try {
            await jwtService.addRefreshTokenToBlackList(req.user!._id, refreshToken)
        } catch (e) {
            console.log(e)
            res.sendStatus(401)
            return
        }

        const tokens = await jwtService.createJWT(req.user!._id)
        res.cookie('refreshJWT', tokens.refreshToken, {httpOnly: true, secure: true})
        res.status(200).send(tokens.accessToken)

    })

authRouter.post('/logout',
    jwtRefreshMiddleware,
    async (req: Request, res: Response) => {
        try {
            await jwtService.addRefreshTokenToBlackList(req.user!._id, req.cookies.refreshJWT)
            res.sendStatus(204)
        } catch (e) {
            console.log(e)
            res.sendStatus(401)
        }
    })


authRouter.get('/me',
    jwtMiddleware,
    async (req: Request, res: Response<DataViewByToken>) => {

        if (!req.user) {
            res.sendStatus(401)
            return
        }

        const user = await usersQueryRepository.findUserWithToken(req.user._id)

        if (!user) {
            res.sendStatus(404)
            return
        }
        res.status(200).send(user)
    })

authRouter.post('/registration',
    userValidationByRegistration,
    async (req: RequestWithBody<UserInputModel>, res: Response) => {
        const newUser = await usersService.createUserByRegistration(req.body)
        if (!newUser) {
            res.sendStatus(500)
        } else {
            res.sendStatus(204)
        }

    })

authRouter.post('/registration-confirmation',
    codeConfirmationValidation,
    errorsValidationMiddleware,
    async (req: RequestWithBody<CodeConfirmation>, res: Response) => {
        const codeIsConfirmed = await usersService.confirmEmail(req.body.code)
        if (!codeIsConfirmed) {
            res.status(400).send({
                "errorsMessages": [
                    {
                        "message": "string",
                        "field": "code"
                    }
                ]
            })
        } else {
            res.sendStatus(204)
        }
    })

authRouter.post('/registration-email-resending',
    emailValidationResending,
    errorsValidationMiddleware,
    async (req: RequestWithBody<EmailType>, res: Response) => {
        const emailResending = await usersService.emailResending(req.body.email)
        if (!emailResending) {
            res.status(400).send({
                "errorsMessages": [
                    {
                        "message": "string",
                        "field": "email"
                    }
                ]
            })
        } else {
            res.sendStatus(204)
        }
    })