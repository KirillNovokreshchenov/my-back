"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyMiddleware = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const videos_1 = require("./routes/videos");
const testing_1 = require("./routes/testing");
const blogs_1 = require("./routes/blogs");
const posts_1 = require("./routes/posts");
exports.app = (0, express_1.default)();
exports.bodyMiddleware = (0, body_parser_1.default)();
exports.app.use(exports.bodyMiddleware);
exports.app.use('/videos', videos_1.videoRouter);
exports.app.use('/testing', testing_1.testingRouter);
exports.app.use('/blogs', blogs_1.blogRouter);
exports.app.use('/posts', posts_1.postRouter);
