import {body} from "express-validator";


export const contentValidation = body('content')
    .isString()
    .withMessage('incorrect content')
    .trim()
    .notEmpty()
    .withMessage('incorrect content')
    .isLength({min: 20, max: 300})
    .withMessage('incorrect content')
