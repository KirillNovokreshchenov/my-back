"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRouter = exports.dbVideos = void 0;
const express_1 = require("express");
const validation_1 = require("../helpers/validation");
const publicationDate_1 = require("../helpers/publicationDate");
const videoUpdate_1 = require("../helpers/videoUpdate");
exports.dbVideos = {
    videos: [{
            id: 1,
            title: 'string',
            author: 'string',
            canBeDownloaded: true,
            minAgeRestriction: 34,
            createdAt: 'string',
            publicationDate: 'string',
            availableResolutions: ['P720']
        }]
};
exports.videoRouter = (0, express_1.Router)();
exports.videoRouter.get('/', (req, res) => {
    res.send(exports.dbVideos.videos);
});
exports.videoRouter.get('/:id', (req, res) => {
    let video = exports.dbVideos.videos.find(el => el.id === +req.params.id);
    if (video) {
        res.send(video);
    }
    else
        res.sendStatus(404);
});
exports.videoRouter.post('/', (req, res) => {
    if ((0, validation_1.validation)(req.body).errorsMessages.length) {
        res.status(400).send((0, validation_1.validation)(req.body));
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
    exports.dbVideos.videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.videoRouter.put('/:id', (req, res) => {
    const desiredVideo = exports.dbVideos.videos.find(el => el.id === +req.params.id);
    if (desiredVideo) {
        if ((0, validation_1.validation)(req.body).errorsMessages.length) {
            res.status(400).send((0, validation_1.validation)(req.body));
        }
        else {
            (0, videoUpdate_1.videoUpdate)(desiredVideo, req.body);
            res.sendStatus(204);
        }
    }
    else
        res.sendStatus(404);
});
exports.videoRouter.delete('/:id', (req, res) => {
    if (exports.dbVideos.videos.find(el => el.id === +req.params.id)) {
        exports.dbVideos.videos = exports.dbVideos.videos.filter(el => el.id !== +req.params.id);
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
