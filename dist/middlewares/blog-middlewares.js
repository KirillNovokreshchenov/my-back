"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websiteUrlValidation = exports.descriptionValidation = exports.nameValidation = void 0;
const express_validator_1 = require("express-validator");
exports.nameValidation = (0, express_validator_1.body)('name').isString().isLength({ max: 15 }).withMessage('incorrect name, max length 15 symbols');
exports.descriptionValidation = (0, express_validator_1.body)('description').isString().isLength({ max: 500 }).withMessage('incorrect description, max length 500 symbols');
exports.websiteUrlValidation = (0, express_validator_1.body)('websiteUrl').isString().isLength({ max: 100 }).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('incorrect website URL');
