import {NextFunction, Request, Response} from "express";

export const authorizationValidation = (req: Request, res: Response, next: NextFunction)=>{
    // const authArr = req.headers.authorization!.split(' ')
    // const auth = Buffer.from(authArr[1], 'base64').toString('ascii')
    // if(auth === 'admin:qwerty'){
    //     next()
    // } else{
    //     res.sendStatus(401)
    // }
    if(req.headers.authorization === 'Basic YWRtaW46cXdlcnR5'){
        next()
    } else {
        res.sendStatus(401)
    }

}