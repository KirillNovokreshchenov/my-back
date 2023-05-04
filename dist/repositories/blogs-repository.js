"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_blogs_1 = require("../db/db-blogs");
exports.blogsRepository = {
    allBlogs() {
        return db_blogs_1.dbBlogs.blogs;
    },
    createBlog(name, description, websiteUrl) {
        const createBlog = {
            id: `${+new Date()}`,
            name: name,
            description: description,
            websiteUrl: websiteUrl
        };
        db_blogs_1.dbBlogs.blogs.push(createBlog);
        return createBlog;
    },
    findBlog(id) {
        return db_blogs_1.dbBlogs.blogs.find(blog => blog.id === id);
    },
    updateBlog(id, name, description, websiteUrl) {
        let foundBlog = db_blogs_1.dbBlogs.blogs.find(blog => blog.id === id);
        if (foundBlog) {
            foundBlog.name = name;
            foundBlog.description = description;
            foundBlog.websiteUrl = websiteUrl;
            return true;
        }
        else {
            return false;
        }
    },
    deleteBlog(id) {
        for (let i = 0; i < db_blogs_1.dbBlogs.blogs.length; i++) {
            if (db_blogs_1.dbBlogs.blogs[i].id === id) {
                db_blogs_1.dbBlogs.blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};
