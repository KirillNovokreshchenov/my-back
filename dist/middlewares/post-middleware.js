"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogIdValidation = exports.contentValidation = exports.shortDescriptionValidation = exports.titleValidation = void 0;
const express_validator_1 = require("express-validator");
const db_blogs_1 = require("../db/db-blogs");
exports.titleValidation = (0, express_validator_1.body)('title').isString().isLength({ max: 30 }).withMessage('incorrect title, max length 30 symbols');
exports.shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').isString().isLength({ max: 100 }).withMessage('incorrect description, max length 100 symbols');
exports.contentValidation = (0, express_validator_1.body)('content').isString().isLength({ max: 1000 }).withMessage('incorrect content, max length 1000 symbols');
exports.blogIdValidation = (0, express_validator_1.body)('blogId').custom(value => {
    return db_blogs_1.dbBlogs.blogs.find(blog => blog.id === value);
}).withMessage('incorrect blogId');
