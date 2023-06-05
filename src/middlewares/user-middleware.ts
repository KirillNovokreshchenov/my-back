import {body} from "express-validator";
import {authorizationValidation} from "./auth-middleware";
import {errorsValidationMiddleware} from "./err-middleware";
import {collectionUsers} from "../db/db";



const loginValidation = body('login')
    .isString()
    .trim()
    .notEmpty()
    .isLength({min: 3, max: 10})
    .matches(/^[a-zA-Z0-9_-]*$/)
    .custom(async value =>{
        const foundUser = await collectionUsers.findOne({login: value});
        if(foundUser) {
            throw new Error('incorrect login')
        }
    })

const passwordValidation = body('password')
    .isString()
    .trim()
    .notEmpty()
    .isLength({min: 6, max: 20})

const emailValidation = body('email')
    .isString()
    .trim()
    .notEmpty()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .custom(async value =>{
        const foundUser = await collectionUsers.findOne({email: value});
        if(foundUser) {
            throw new Error('incorrect email')
        }
    })

export const emailValidationResending = body('email')
    .isString()
    .trim()
    .notEmpty()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)







export const userValidation = [authorizationValidation, loginValidation, passwordValidation, emailValidation, errorsValidationMiddleware]

export const userValidationByRegistration = [loginValidation, passwordValidation, emailValidation, errorsValidationMiddleware]
