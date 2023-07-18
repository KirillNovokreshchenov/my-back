import {body} from "express-validator";
import {authorizationValidation} from "./auth-middleware";
import {errorsValidationMiddleware} from "./err-middleware";
import {mongoIdMiddleware} from "./mongoIdMiddleware";
import {ObjectId} from "mongodb";
import {BlogModelClass} from "../domain/schema-blog";


const titleValidation = body('title')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect title, max length 30 symbols, min 1 symbol')
    .isLength({min: 1, max: 30})
    .withMessage('incorrect title, max length 30 symbols, min 1 symbol')
const shortDescriptionValidation = body('shortDescription')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect description, max length 100 symbols, min 1 symbol')
    .isLength({min: 1, max: 100})
    .withMessage('incorrect description, max length 100 symbols, min 1 symbol')
const contentValidation = body('content')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect content, max length 1000 symbols, min 1 symbol')
    .isLength({min: 1, max: 1000})
    .withMessage('incorrect content, max length 1000 symbols, min 1 symbol')
const createdAtValidation = body('createdAt')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect ISO date')
    .matches(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
    .withMessage('incorrect ISO date')
const blogIdValidation = body('blogId')
    .custom(async value =>{
        const foundBlog = await BlogModelClass.findOne({_id: new ObjectId(value)});
        if(!foundBlog){
            throw new Error('incorrect blogId')
        }
    })






export const postValidate = [authorizationValidation, titleValidation, shortDescriptionValidation, contentValidation, createdAtValidation, blogIdValidation, errorsValidationMiddleware]

export const postValidateForBlog = [authorizationValidation, mongoIdMiddleware, titleValidation, shortDescriptionValidation, contentValidation, createdAtValidation, errorsValidationMiddleware]