"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const posts_repository_1 = require("../repositories/posts-repository");
const post_middleware_1 = require("../middlewares/post-middleware");
const common_middleware_1 = require("../middlewares/common-middleware");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.get('/', (req, res) => {
    const allPosts = posts_repository_1.postsRepository.allPosts();
    res.send(allPosts);
});
exports.postRouter.post('/', common_middleware_1.authorizationValidation, post_middleware_1.titleValidation, post_middleware_1.shortDescriptionValidation, post_middleware_1.contentValidation, post_middleware_1.blogIdValidation, common_middleware_1.errorsValidationMiddleware, (req, res) => {
    const newPost = posts_repository_1.postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(201).send(newPost);
});
exports.postRouter.get('/:id([0-9]+)', (req, res) => {
    const foundPost = posts_repository_1.postsRepository.findPost(req.params.id);
    if (foundPost) {
        res.send(foundPost);
    }
    else {
        res.sendStatus(404);
    }
});
exports.postRouter.put('/:id([0-9]+)', common_middleware_1.authorizationValidation, post_middleware_1.titleValidation, post_middleware_1.shortDescriptionValidation, post_middleware_1.contentValidation, post_middleware_1.blogIdValidation, common_middleware_1.errorsValidationMiddleware, (req, res) => {
    const isUpdate = posts_repository_1.postsRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content);
    if (isUpdate) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.postRouter.delete('/:id([0-9]+)', common_middleware_1.authorizationValidation, (req, res) => {
    const isDeleted = posts_repository_1.postsRepository.deletePost(req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
