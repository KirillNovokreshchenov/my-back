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
const mongoIdMiddleware_1 = require("../middlewares/mongoIdMiddleware");
const format_id_ObjectId_1 = require("../helpers/format-id-ObjectId");
const auth_jwt_middleware_1 = require("../middlewares/auth-jwt-middleware");
const comment_middleware_1 = require("../middlewares/comment-middleware");
const comments_service_1 = require("../domain/comments-service");
const query_comments_repository_1 = require("../repositories/query-comments-repository");
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
exports.postRouter.get('/:id', mongoIdMiddleware_1.mongoIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield query_posts_repository_1.postsQueryRepository.findPost((0, format_id_ObjectId_1.formatIdInObjectId)(req.params.id));
    if (foundPost) {
        res.send(foundPost);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postRouter.put('/:id', post_middleware_1.postValidate, mongoIdMiddleware_1.mongoIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdate = yield posts_service_1.postsService.updatePost(req.params.id, req.body);
    if (isUpdate) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postRouter.delete('/:id', auth_middleware_1.authorizationValidation, mongoIdMiddleware_1.mongoIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield posts_service_1.postsService.deletePost(req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postRouter.post('/:id/comments', auth_jwt_middleware_1.jwtMiddleware, mongoIdMiddleware_1.mongoIdMiddleware, comment_middleware_1.contentValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = yield comments_service_1.commentsService.createComment(req.params.id, req.user, req.body.content);
    if (!commentId) {
        res.sendStatus(404);
    }
    else {
        const newComment = yield query_comments_repository_1.queryCommentsRepository.findComment(commentId);
        res.send(newComment);
    }
}));
exports.postRouter.get('/:id/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield query_comments_repository_1.queryCommentsRepository.getComments(req.params.id, req.query);
    if (!comments) {
        res.sendStatus(404);
    }
    else {
        res.send(comments);
    }
}));
