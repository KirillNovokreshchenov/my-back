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
exports.postsRepository = void 0;
const findBlogName_1 = require("../helpers/post-helpers/findBlogName");
const db_1 = require("../db/db");
exports.postsRepository = {
    allPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.collectionPosts.find({}, { projection: { _id: 0, isMembership: 0 } }).toArray();
        });
    },
    createPost({ title, shortDescription, content, blogId, createdAt }) {
        return __awaiter(this, void 0, void 0, function* () {
            const createPost = {
                id: `${+new Date()}`,
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: yield (0, findBlogName_1.findBlogName)(blogId),
                createdAt: createdAt || new Date().toISOString(),
                isMembership: false
            };
            yield db_1.collectionPosts.insertOne(createPost);
            const foundNewCreatedPost = yield db_1.collectionPosts.findOne({ id: createPost.id }, { projection: { _id: 0, isMembership: 0 } });
            return foundNewCreatedPost;
        });
    },
    findPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.collectionPosts.findOne({ id: id }, { projection: { _id: 0, isMembership: 0 } });
        });
    },
    updatePost(id, { title, shortDescription, content, createdAt }) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundPost = yield db_1.collectionPosts.findOne({ id: id });
            const result = createdAt ?
                yield db_1.collectionPosts.updateOne({ id }, { $set: { title, shortDescription, content, createdAt } })
                : yield db_1.collectionPosts.updateOne({ id }, { $set: { title, shortDescription, content } });
            return result.matchedCount === 1;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.collectionPosts.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    }
};
