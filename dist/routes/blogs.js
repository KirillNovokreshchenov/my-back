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
exports.blogRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const blog_middlewares_1 = require("../middlewares/blog-middlewares");
const auth_middleware_1 = require("../middlewares/auth-middleware");
exports.blogRouter = (0, express_1.Router)();
exports.blogRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allBlogs = yield blogs_repository_1.blogsRepository.allBlogs();
    res.send(allBlogs);
}));
exports.blogRouter.post('/', blog_middlewares_1.blogValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = yield blogs_repository_1.blogsRepository.createBlog(req.body);
    res.status(201).send(newBlog);
}));
exports.blogRouter.get('/:id([0-9]+)', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogs_repository_1.blogsRepository.findBlog(req.params.id);
    if (foundBlog) {
        res.send(foundBlog);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogRouter.put('/:id([0-9]+)', blog_middlewares_1.blogValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdate = yield blogs_repository_1.blogsRepository.updateBlog(req.params.id, req.body);
    if (isUpdate) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogRouter.delete('/:id([0-9]+)', auth_middleware_1.authorizationValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
