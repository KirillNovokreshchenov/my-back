import {Response, Router} from "express";
import {RequestWithBody} from "../types";
import {LoginModel} from "../models/auth-models/LoginModel";
import {usersService} from "../domain/users-service";
import {loginValidation} from "../middlewares/login-middleware";


export const authRouter = Router()

authRouter.post('/login',
    loginValidation,
    async (req: RequestWithBody<LoginModel>, res: Response)=>{
    const checkResult = await usersService.checkCredentials(req.body)
    if(!checkResult){
        res.sendStatus(401)
    } else{
        res.sendStatus(204)

    }

})