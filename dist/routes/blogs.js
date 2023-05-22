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
const blogs_service_1 = require("../domain/blogs-service");
const blog_middlewares_1 = require("../middlewares/blog-middlewares");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const query_blogs_repository_1 = require("../repositories/query-blogs-repository");
const query_posts_repository_1 = require("../repositories/query-posts-repository");
const mongoIdMiddleware_1 = require("../middlewares/mongoIdMiddleware");
const post_middleware_1 = require("../middlewares/post-middleware");
const format_id_ObjectId_1 = require("../helpers/format-id-ObjectId");
exports.blogRouter = (0, express_1.Router)();
exports.blogRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allBlogs = yield query_blogs_repository_1.blogsQueryRepository.allBlogs(req.query);
    res.json(allBlogs);
}));
exports.blogRouter.get('/:id/posts', mongoIdMiddleware_1.mongoIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allPostsForBlog = yield query_blogs_repository_1.blogsQueryRepository.allPostsForBlog(req.params.id, req.query);
    if (!allPostsForBlog) {
        res.sendStatus(404);
    }
    else {
        res.send(allPostsForBlog);
    }
}));
exports.blogRouter.post('/', blog_middlewares_1.blogValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idBlog = yield blogs_service_1.blogsService.createBlog(req.body);
    const newBlog = yield query_blogs_repository_1.blogsQueryRepository.findBlog(idBlog);
    res.status(201).send(newBlog);
}));
exports.blogRouter.post('/:id/posts', post_middleware_1.postValidateForBlog, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idPost = yield blogs_service_1.blogsService.createPostForBlog(req.params.id, req.body);
    const foundNewPost = yield query_posts_repository_1.postsQueryRepository.findPost(idPost);
    res.status(201).send(foundNewPost);
}));
exports.blogRouter.get('/:id', mongoIdMiddleware_1.mongoIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield query_blogs_repository_1.blogsQueryRepository.findBlog((0, format_id_ObjectId_1.formatIdInObjectId)(req.params.id));
    if (foundBlog) {
        res.send(foundBlog);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogRouter.put('/:id', blog_middlewares_1.blogValidate, mongoIdMiddleware_1.mongoIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdate = yield blogs_service_1.blogsService.updateBlog(req.params.id, req.body);
    if (isUpdate) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogRouter.delete('/:id', auth_middleware_1.authorizationValidation, mongoIdMiddleware_1.mongoIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield blogs_service_1.blogsService.deleteBlog(req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
