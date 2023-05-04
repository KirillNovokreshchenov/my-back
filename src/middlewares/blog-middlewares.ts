import {body} from "express-validator";


export const nameValidation = body('name').isString().trim().isLength({min: 1, max: 15}).withMessage('incorrect name, max length 15 symbols')
export const descriptionValidation = body('description').isString().trim().isLength({min: 1, max: 500}).withMessage('incorrect description, max length 500 symbols')
export const websiteUrlValidation = body('websiteUrl').isString().trim().isLength({min: 1, max:100}).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('incorrect website URL')


