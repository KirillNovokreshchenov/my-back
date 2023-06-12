import {NextFunction, Request, Response} from "express";
import {Result, validationResult} from "express-validator";
import {RESPONSE_STATUS} from "../types/resStatus";


export const errorsValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result: Result = validationResult(req);
    if (result.isEmpty()) {
        next()
    } else {
        const errors: { field: string; message: string }[] = result
            .formatWith(error => {
            return {message: error.msg, field: error.type === "field" ? error.path : error.type}})
            .array({ onlyFirstError: true });
        res.status(RESPONSE_STATUS.BAD_REQUEST_400).send({errorsMessages: errors})

    }
}