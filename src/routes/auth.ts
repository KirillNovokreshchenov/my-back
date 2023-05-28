import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {LoginModel} from "../models/auth-models/LoginModel";
import {usersService} from "../domain/users-service";
import {loginValidation} from "../middlewares/login-middleware";
import {jwtService} from "../application/jwt-service";
import {jwtMiddleware} from "../middlewares/auth-jwt-middleware";
import {usersQueryRepository} from "../repositories/query-users-repository";
import {JWTtokenViewModel} from "../models/auth-models/JWTtokenViewModel";


export const authRouter = Router()

authRouter.post('/login',
    loginValidation,
    async (req: RequestWithBody<LoginModel>, res: Response<JWTtokenViewModel>) => {
        const userId = await usersService.checkCredentials(req.body)
        if (userId) {
            const token = await jwtService.createJWT(userId)
            res.status(200).send(token)
        } else {
            res.sendStatus(401)

        }
    })

authRouter.get('/me',
    jwtMiddleware,
    async (req: Request, res: Response) => {
        const user = await usersQueryRepository.findUserWithToken(req.user!._id)
        res.status(200).send(user)
    })