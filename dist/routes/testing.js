"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const db_videos_1 = require("../db/db-videos");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete('/all-data', (req, res) => {
    db_videos_1.dbVideos.videos = [];
    res.sendStatus(204);
});
