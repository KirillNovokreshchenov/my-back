"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidateForBlog = exports.postValidate = void 0;
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("./auth-middleware");
const err_middleware_1 = require("./err-middleware");
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const titleValidation = (0, express_validator_1.body)('title')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect title, max length 30 symbols, min 1 symbol')
    .isLength({ min: 1, max: 30 })
    .withMessage('incorrect title, max length 30 symbols, min 1 symbol');
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect description, max length 100 symbols, min 1 symbol')
    .isLength({ min: 1, max: 100 })
    .withMessage('incorrect description, max length 100 symbols, min 1 symbol');
const contentValidation = (0, express_validator_1.body)('content')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect content, max length 1000 symbols, min 1 symbol')
    .isLength({ min: 1, max: 1000 })
    .withMessage('incorrect content, max length 1000 symbols, min 1 symbol');
const createdAtValidation = (0, express_validator_1.body)('createdAt')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('incorrect ISO date')
    .matches(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
    .withMessage('incorrect ISO date');
const blogIdValidation = (0, express_validator_1.body)('blogId')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const objId = new mongodb_1.BSON.ObjectId(value);
    const foundBlog = yield db_1.collectionBlogs.findOne({ _id: objId });
    if (!foundBlog) {
        throw new Error('incorrect blogId');
    }
}));
exports.postValidate = [auth_middleware_1.authorizationValidation, titleValidation, shortDescriptionValidation, contentValidation, createdAtValidation, blogIdValidation, err_middleware_1.errorsValidationMiddleware];
exports.postValidateForBlog = [auth_middleware_1.authorizationValidation, titleValidation, shortDescriptionValidation, contentValidation, createdAtValidation, err_middleware_1.errorsValidationMiddleware];
