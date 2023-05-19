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
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
exports.blogsRepository = {
    createBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.collectionBlogs.insertOne(newBlog);
            return newBlog._id;
        });
    },
    createPostForBlog(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.collectionPosts.insertOne(newPost);
            return newPost._id;
        });
    },
    updateBlog(id, name, description, websiteUrl, optionalPropertiesIsValid) {
        return __awaiter(this, void 0, void 0, function* () {
            const objId = new mongodb_1.BSON.ObjectId(id);
            const result = yield db_1.collectionBlogs.updateOne({ _id: objId }, { $set: Object.assign({ name, description, websiteUrl }, optionalPropertiesIsValid) });
            yield db_1.collectionPosts.updateMany({ blogId: id }, { $set: { blogName: name } });
            return result.matchedCount === 1;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const objId = new mongodb_1.BSON.ObjectId(id);
            const result = yield db_1.collectionBlogs.deleteOne({ _id: objId });
            return result.deletedCount === 1;
        });
    }
};
