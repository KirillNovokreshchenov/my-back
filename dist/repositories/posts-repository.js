"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_posts_1 = require("../db/db-posts");
const findBlogName_1 = require("../helpers/post-helpers/findBlogName");
exports.postsRepository = {
    allPosts() {
        return db_posts_1.dbPosts.posts;
    },
    createPost(title, shortDescription, content, blogId) {
        const createPost = {
            id: `${+new Date()}`,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: (0, findBlogName_1.findBlogName)(blogId)
        };
        db_posts_1.dbPosts.posts.push(createPost);
        return createPost;
    },
    findPost(id) {
        return db_posts_1.dbPosts.posts.find(post => post.id === id);
    },
    updatePost(id, title, shortDescription, content) {
        let foundPost = db_posts_1.dbPosts.posts.find(post => post.id === id);
        if (foundPost) {
            foundPost.title = title;
            foundPost.shortDescription = shortDescription;
            foundPost.content = content;
            return true;
        }
        else {
            return false;
        }
    },
    deletePost(id) {
        for (let i = 0; i < db_posts_1.dbPosts.posts.length; i++) {
            if (db_posts_1.dbPosts.posts[i].id === id) {
                db_posts_1.dbPosts.posts.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};
