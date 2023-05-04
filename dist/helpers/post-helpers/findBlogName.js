"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBlogName = void 0;
const db_blogs_1 = require("../../db/db-blogs");
function findBlogName(blogId) {
    const foundBlog = db_blogs_1.dbBlogs.blogs.find(blog => blog.id === blogId);
    return foundBlog.name;
}
exports.findBlogName = findBlogName;
