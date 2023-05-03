"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRouter = void 0;
const express_1 = require("express");
const validation_1 = require("../helpers/videoHelpers/validation");
const publicationDate_1 = require("../helpers/videoHelpers/publicationDate");
const videoUpdate_1 = require("../helpers/videoHelpers/videoUpdate");
const db_videos_1 = require("../db/db-videos");
exports.videoRouter = (0, express_1.Router)();
exports.videoRouter.get('/', (req, res) => {
    res.send(db_videos_1.dbVideos.videos);
});
exports.videoRouter.get('/:id([0-9]+)', (req, res) => {
    let video = db_videos_1.dbVideos.videos.find(el => el.id === +req.params.id);
    if (video) {
        res.send(video);
    }
    else
        res.sendStatus(404);
});
exports.videoRouter.post('/', (req, res) => {
    const errors = (0, validation_1.validation)(req.body);
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const newVideo = {
        id: req.body.id || +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded || false,
        minAgeRestriction: req.body.minAgeRestriction || null,
        createdAt: req.body.createdAt || new Date().toISOString(),
        publicationDate: req.body.publicationDate || (0, publicationDate_1.publicationDate)(),
        availableResolutions: req.body.availableResolutions || []
    };
    db_videos_1.dbVideos.videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.videoRouter.put('/:id([0-9]+)', (req, res) => {
    const foundVideo = db_videos_1.dbVideos.videos.find(el => el.id === +req.params.id);
    if (foundVideo) {
        if ((0, validation_1.validation)(req.body).errorsMessages.length) {
            res.status(400).send((0, validation_1.validation)(req.body));
        }
        else {
            (0, videoUpdate_1.videoUpdate)(foundVideo, req.body);
            res.sendStatus(204);
        }
    }
    else
        res.sendStatus(404);
});
exports.videoRouter.delete('/:id([0-9]+)', (req, res) => {
    if (db_videos_1.dbVideos.videos.find(el => el.id === +req.params.id)) {
        db_videos_1.dbVideos.videos = db_videos_1.dbVideos.videos.filter(el => el.id !== +req.params.id);
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
