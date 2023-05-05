"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const db_videos_1 = require("../db/db-videos");
const db_blogs_1 = require("../db/db-blogs");
const db_posts_1 = require("../db/db-posts");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete('/all-data', (req, res) => {
    db_videos_1.dbVideos.videos = [];
    db_blogs_1.dbBlogs.blogs = [];
    db_posts_1.dbPosts.posts = [];
    res.sendStatus(204);
});
