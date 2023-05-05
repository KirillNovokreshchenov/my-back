"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogIdValidation = exports.contentValidation = exports.shortDescriptionValidation = exports.titleValidation = void 0;
const express_validator_1 = require("express-validator");
const db_blogs_1 = require("../db/db-blogs");
exports.titleValidation = (0, express_validator_1.body)('title').isString().trim().isLength({ min: 1, max: 30 }).withMessage('incorrect title, max length 30 symbols, min 1 symbol');
exports.shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').trim().isString().isLength({ min: 1, max: 100 }).withMessage('incorrect description, max length 100 symbols, min 1 symbol');
exports.contentValidation = (0, express_validator_1.body)('content').isString().trim().isLength({ min: 1, max: 1000 }).withMessage('incorrect content, max length 1000 symbols, min 1 symbol');
exports.blogIdValidation = (0, express_validator_1.body)('blogId').custom(value => {
    return db_blogs_1.dbBlogs.blogs.find(blog => blog.id === value);
}).withMessage('incorrect blogId');
