import {collectionUsers} from "../db/db";
import {errorsValidationMiddleware} from "./err-middleware";
import {body} from "express-validator";

const loginOrEmailValidation = body('loginOrEmail').isString().trim().notEmpty()
const passwordValidation = body('password').isString().trim().notEmpty()


export const loginValidation = [loginOrEmailValidation, passwordValidation, errorsValidationMiddleware]