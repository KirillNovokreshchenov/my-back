"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsValidationMiddleware = exports.authorizationValidation = void 0;
const express_validator_1 = require("express-validator");
const authorizationValidation = (req, res, next) => {
    if (req.headers.authorization === 'Basic YWRtaW46cXdlcnR5') {
        next();
    }
    else {
        res.sendStatus(401);
    }
};
exports.authorizationValidation = authorizationValidation;
const errorsValidationMiddleware = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        next();
    }
    else {
        const errors = result.formatWith(error => {
            return { message: error.msg, field: error.type === "field" ? error.path : error.type };
        }).array({ onlyFirstError: true });
        res.status(400).send({ errorsMessages: errors });
    }
};
exports.errorsValidationMiddleware = errorsValidationMiddleware;
