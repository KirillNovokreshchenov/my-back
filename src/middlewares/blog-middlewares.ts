import {NextFunction, Request, Response} from "express";
import {body, Result, validationResult} from "express-validator";


export const authorizationValidation = (req: Request, res: Response, next: NextFunction)=>{
      if(req.headers.authorization === 'Basic YWRtaW46cXdlcnR5'){
          next()
      } else {
          res.sendStatus(401)
      }

}

export const nameValidation = body('name').isString().isLength({max: 15})
export const descriptionValidation = body('description').isString().isLength({max: 500})
export const websiteUrlValidation = body('websiteUrl').isString().isLength({max:100}).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)



export const errorsValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result: Result = validationResult(req);
    if (result.isEmpty()) {
        next()
    } else {
        const errors: { field: string; message: string }[] = result.formatWith(error => {
            return {message: error.msg as string, field: error.type === "field" ? error.path : error.type}
        }).array({ onlyFirstError: true });
        res.status(400).send({errorsMessages: errors})

    }
}