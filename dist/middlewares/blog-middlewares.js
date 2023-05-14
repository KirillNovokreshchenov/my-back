"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidate = void 0;
const express_validator_1 = require("express-validator");
const err_middleware_1 = require("./err-middleware");
const auth_middleware_1 = require("./auth-middleware");
const nameValidation = (0, express_validator_1.body)('name')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect name, max length 15 symbols')
    .isLength({ min: 1, max: 15 })
    .withMessage('incorrect name, max length 15 symbols');
const descriptionValidation = (0, express_validator_1.body)('description')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect description, max length 500 symbols')
    .isLength({ min: 1, max: 500 })
    .withMessage('incorrect description, max length 500 symbols');
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect website URL')
    .isLength({ min: 1, max: 100 })
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('incorrect website URL');
const createdAtValidation = (0, express_validator_1.body)('createdAt')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect ISO date')
    .matches(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
    .withMessage('incorrect ISO date');
exports.blogValidate = [auth_middleware_1.authorizationValidation, nameValidation, descriptionValidation, websiteUrlValidation, createdAtValidation, err_middleware_1.errorsValidationMiddleware];
