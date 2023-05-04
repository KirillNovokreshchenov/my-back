"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const blog_middlewares_1 = require("../middlewares/blog-middlewares");
const common_middleware_1 = require("../middlewares/common-middleware");
exports.blogRouter = (0, express_1.Router)();
exports.blogRouter.get('/', (req, res) => {
    const allBlogs = blogs_repository_1.blogsRepository.allBlogs();
    res.send(allBlogs);
});
exports.blogRouter.post('/', common_middleware_1.authorizationValidation, blog_middlewares_1.nameValidation, blog_middlewares_1.descriptionValidation, blog_middlewares_1.websiteUrlValidation, common_middleware_1.errorsValidationMiddleware, (req, res) => {
    const newBlog = blogs_repository_1.blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(201).send(newBlog);
});
exports.blogRouter.get('/:id([0-9]+)', (req, res) => {
    const foundBlog = blogs_repository_1.blogsRepository.findBlog(req.params.id);
    if (foundBlog) {
        res.send(foundBlog);
    }
    else {
        res.sendStatus(404);
    }
});
exports.blogRouter.put('/:id([0-9]+)', common_middleware_1.authorizationValidation, blog_middlewares_1.nameValidation, blog_middlewares_1.descriptionValidation, blog_middlewares_1.websiteUrlValidation, common_middleware_1.errorsValidationMiddleware, (req, res) => {
    const isUpdate = blogs_repository_1.blogsRepository.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
    if (isUpdate) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.blogRouter.delete('/:id([0-9]+)', common_middleware_1.authorizationValidation, (req, res) => {
    const isDeleted = blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
