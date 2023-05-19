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
const post_middleware_1 = require("../middlewares/post-middleware");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const posts_service_1 = require("../domain/posts-service");
const query_posts_repository_1 = require("../repositories/query-posts-repository");
const objId_middleware_1 = require("../middlewares/objId-middleware");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allPosts = yield query_posts_repository_1.postsQueryRepository.allPosts(req.query);
    res.send(allPosts);
}));
exports.postRouter.post('/', post_middleware_1.postValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const objId = yield posts_service_1.postsService.createPost(req.body);
    const foundNewCreatePost = yield query_posts_repository_1.postsQueryRepository.findPost(objId);
    res.status(201).send(foundNewCreatePost);
}));
exports.postRouter.get('/:id', objId_middleware_1.mongoIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield query_posts_repository_1.postsQueryRepository.findPost(req.params.id);
    if (foundPost) {
        res.send(foundPost);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postRouter.put('/:id', post_middleware_1.postValidate, objId_middleware_1.mongoIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdate = yield posts_service_1.postsService.updatePost(req.params.id, req.body);
    if (isUpdate) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postRouter.delete('/:id', auth_middleware_1.authorizationValidation, objId_middleware_1.mongoIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield posts_service_1.postsService.deletePost(req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
