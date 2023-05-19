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
exports.blogValidate = exports.foundBlogForCreatePost = void 0;
const express_validator_1 = require("express-validator");
const err_middleware_1 = require("./err-middleware");
const auth_middleware_1 = require("./auth-middleware");
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const nameValidation = (0, express_validator_1.body)('name')
    .isString()
    .withMessage('incorrect name, max length 15 symbols')
    .trim()
    .withMessage('incorrect name, max length 15 symbols')
    .notEmpty()
    .withMessage('incorrect name, max length 15 symbols')
    .isLength({ min: 1, max: 15 })
    .withMessage('incorrect name, max length 15 symbols');
const descriptionValidation = (0, express_validator_1.body)('description')
    .isString()
    .withMessage('incorrect description, max length 500 symbols')
    .trim()
    .withMessage('incorrect description, max length 500 symbols')
    .notEmpty()
    .withMessage('incorrect description, max length 500 symbols')
    .isLength({ min: 1, max: 500 })
    .withMessage('incorrect description, max length 500 symbols');
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .isString()
    .withMessage('incorrect website URL')
    .trim()
    .withMessage('incorrect website URL')
    .notEmpty()
    .withMessage('incorrect website URL')
    .isLength({ min: 1, max: 100 })
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('incorrect website URL');
const createdAtValidation = (0, express_validator_1.body)('createdAt')
    .optional()
    .isString()
    .withMessage('incorrect ISO date')
    .trim()
    .withMessage('incorrect ISO date')
    .notEmpty()
    .withMessage('incorrect ISO date')
    .matches(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
    .withMessage('incorrect ISO date');
const foundBlogForCreatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const objId = new mongodb_1.BSON.ObjectId(req.params.id);
    const foundBlog = yield db_1.collectionBlogs.findOne({ _id: objId });
    if (!foundBlog) {
        res.sendStatus(404);
    }
    else {
        next();
    }
});
exports.foundBlogForCreatePost = foundBlogForCreatePost;
exports.blogValidate = [auth_middleware_1.authorizationValidation, nameValidation, descriptionValidation, websiteUrlValidation, createdAtValidation, err_middleware_1.errorsValidationMiddleware];
