"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websiteUrlValidation = exports.descriptionValidation = exports.nameValidation = void 0;
const express_validator_1 = require("express-validator");
exports.nameValidation = (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1, max: 15 }).withMessage('incorrect name, max length 15 symbols');
exports.descriptionValidation = (0, express_validator_1.body)('description').isString().trim().isLength({ min: 1, max: 500 }).withMessage('incorrect description, max length 500 symbols');
exports.websiteUrlValidation = (0, express_validator_1.body)('websiteUrl').isString().trim().isLength({ min: 1, max: 100 }).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('incorrect website URL');
