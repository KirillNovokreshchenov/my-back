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
exports.testingRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
const db_videos_1 = require("../db/db-videos");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    db_videos_1.dbVideos.videos = [];
    const promiseBlogs = db_1.collectionBlogs.deleteMany({});
    const promisePosts = db_1.collectionPosts.deleteMany({});
    const promiseUsers = db_1.collectionUsers.deleteMany({});
    const promiseComments = db_1.collectionComments.deleteMany({});
    Promise.all([promiseBlogs, promisePosts, promiseUsers, promiseComments])
        .catch((err) => {
        console.error(err);
    });
    res.sendStatus(204);
}));
