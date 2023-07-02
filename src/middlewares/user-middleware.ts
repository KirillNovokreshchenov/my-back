import {body} from "express-validator";
import {authorizationValidation} from "./auth-middleware";
import {errorsValidationMiddleware} from "./err-middleware";
import {collectionEmail, collectionUsers} from "../db/db";
import {rateLimitsMiddleware} from "./rateLimits-middleware";



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

export const newPasswordValidation = body('newPassword')
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

export const codeConfirmationValidation = body('code')
    .isString()
    .trim()
    .notEmpty()
    .custom(async value =>{
        const foundCode = await collectionEmail.findOne({confirmationCode: value});
        if(!foundCode) {
            throw new Error('incorrect code')
        }
    })







export const userValidation = [authorizationValidation, loginValidation, passwordValidation, emailValidation, errorsValidationMiddleware]

export const userValidationByRegistration = [rateLimitsMiddleware, loginValidation, passwordValidation, emailValidation, errorsValidationMiddleware]
