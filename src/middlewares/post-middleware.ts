import {body} from "express-validator";
import {dbBlogs} from "../db/db-blogs";
import {authorizationValidation} from "./auth-middleware";
import {errorsValidationMiddleware} from "./err-middleware";


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
const blogIdValidation = body('blogId')
    .custom(async value =>{
        const foundBlog = dbBlogs.blogs.find(blog=>blog.id ===value);
        if(!foundBlog){
            throw new Error('incorrect blogId')
        }
    })


export const postValidate = [authorizationValidation, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, errorsValidationMiddleware]