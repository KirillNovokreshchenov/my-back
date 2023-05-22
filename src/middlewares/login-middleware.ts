import {collectionUsers} from "../db/db";
import {errorsValidationMiddleware} from "./err-middleware";
import {body} from "express-validator";

const loginOrEmailValidation = body('loginOrEmail').custom(async (value)=>{
    const existUser = await collectionUsers.findOne({$or: [{login: value}, {email: value}]})
    if(!existUser){
        throw new Error('incorrect loginOrEmail')
    }
})


export const loginValidation = [loginOrEmailValidation, errorsValidationMiddleware]