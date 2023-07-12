import {body} from "express-validator";
import {LIKE_STATUS} from "../models/comment-models/EnumLikeStatusModel";


export const contentValidation = body('content')
    .isString()
    .withMessage('incorrect content')
    .trim()
    .notEmpty()
    .withMessage('incorrect content')
    .isLength({min: 20, max: 300})
    .withMessage('incorrect content')

export const likeStatusValidation = body('likeStatus')
    .isString()
    .trim()
    .notEmpty()
    .custom(async value=>{
        if(!(value.toUpperCase() in LIKE_STATUS)){
            throw new Error('incorrect like status')
        }
    })
