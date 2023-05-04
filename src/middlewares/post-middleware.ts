import {body} from "express-validator";
import {dbBlogs} from "../db/db-blogs";


export const titleValidation = body('title').isString().isLength({max: 30}).withMessage('incorrect title, max length 30 symbols')
export const shortDescriptionValidation = body('shortDescription').isString().isLength({max: 100}).withMessage('incorrect description, max length 100 symbols')
export const contentValidation = body('content').isString().isLength({max: 1000}).withMessage('incorrect content, max length 1000 symbols')
export const blogIdValidation = body('blogId').custom(value =>{
    return dbBlogs.blogs.find(blog=>blog.id ===value)
}).withMessage('incorrect blogId')