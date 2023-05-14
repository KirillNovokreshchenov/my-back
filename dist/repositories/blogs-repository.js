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
exports.blogsRepository = void 0;
const changeBlogNamePosts_1 = require("../helpers/blog-helpers/changeBlogNamePosts");
const db_1 = require("../db/db");
exports.blogsRepository = {
    allBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.collectionBlogs.find({}, { projection: { _id: 0 } }).toArray();
        });
    },
    createBlog({ name, description, websiteUrl, createdAt }) {
        return __awaiter(this, void 0, void 0, function* () {
            const createBlog = {
                id: `${+new Date()}`,
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: createdAt || new Date().toISOString(),
                isMembership: false
            };
            yield db_1.collectionBlogs.insertOne(createBlog);
            const foundNewCreatedBlog = yield db_1.collectionBlogs.findOne({ id: createBlog.id }, { projection: { _id: 0 } });
            return foundNewCreatedBlog;
        });
    },
    findBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.collectionBlogs.findOne({ id: id }, { projection: { _id: 0 } });
        });
    },
    updateBlog(id, { name, description, websiteUrl, createdAt }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = createdAt ?
                yield db_1.collectionBlogs.updateOne({ id }, { $set: { name, description, websiteUrl, createdAt } })
                : yield db_1.collectionBlogs.updateOne({ id }, { $set: { name, description, websiteUrl } });
            yield (0, changeBlogNamePosts_1.changeBlogNamePosts)(id, name);
            return result.matchedCount === 1;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.collectionBlogs.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    }
};
