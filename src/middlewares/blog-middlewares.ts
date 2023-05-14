import {body} from "express-validator";
import {errorsValidationMiddleware} from "./err-middleware";
import {authorizationValidation} from "./auth-middleware";


const nameValidation = body('name')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect name, max length 15 symbols')
    .isLength({min: 1, max: 15})
    .withMessage('incorrect name, max length 15 symbols')
const descriptionValidation = body('description')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect description, max length 500 symbols')
    .isLength({min: 1, max: 500})
    .withMessage('incorrect description, max length 500 symbols')
const websiteUrlValidation = body('websiteUrl')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect website URL')
    .isLength({min: 1, max:100})
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('incorrect website URL')
const createdAtValidation = body('createdAt')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect ISO date')
    .matches(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
    .withMessage('incorrect ISO date')


export const blogValidate = [ authorizationValidation, nameValidation, descriptionValidation, websiteUrlValidation, createdAtValidation, errorsValidationMiddleware]


