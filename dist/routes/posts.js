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
exports.postRouter = void 0;
const express_1 = require("express");
const posts_repository_1 = require("../repositories/posts-repository");
const post_middleware_1 = require("../middlewares/post-middleware");
const auth_middleware_1 = require("../middlewares/auth-middleware");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allPosts = yield posts_repository_1.postsRepository.allPosts();
    res.send(allPosts);
}));
exports.postRouter.post('/', post_middleware_1.postValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield posts_repository_1.postsRepository.createPost(req.body);
    res.status(201).send(newPost);
}));
exports.postRouter.get('/:id([0-9]+)', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield posts_repository_1.postsRepository.findPost(req.params.id);
    if (foundPost) {
        res.send(foundPost);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postRouter.put('/:id([0-9]+)', post_middleware_1.postValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdate = yield posts_repository_1.postsRepository.updatePost(req.params.id, req.body);
    if (isUpdate) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postRouter.delete('/:id([0-9]+)', auth_middleware_1.authorizationValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield posts_repository_1.postsRepository.deletePost(req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
