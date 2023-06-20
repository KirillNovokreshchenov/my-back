import {collectionUsers} from "../db/db";
import {errorsValidationMiddleware} from "./err-middleware";
import {body} from "express-validator";
import {rateLimitsMiddleware} from "./rateLimits-middleware";

const loginOrEmailValidation = body('loginOrEmail').isString().trim().notEmpty()
const passwordValidation = body('password').isString().trim().notEmpty()


export const loginValidation = [rateLimitsMiddleware, loginOrEmailValidation, passwordValidation, errorsValidationMiddleware]