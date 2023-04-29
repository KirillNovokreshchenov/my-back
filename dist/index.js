"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const publicationDate_1 = require("./helpers/publicationDate");
const validation_1 = require("./helpers/validation");
const videoUpdate_1 = require("./helpers/videoUpdate");
const app = (0, express_1.default)();
const port = 3000;
const dbVideos = {
    videos: []
};
const bodyMiddleware = (0, body_parser_1.default)();
app.use(bodyMiddleware);
app.get('/videos', (req, res) => {
    res.send(dbVideos.videos);
});
app.get('/videos/:id', (req, res) => {
    let video = dbVideos.videos.find(el => el.id === +req.params.id);
    if (video) {
        res.send(video);
    }
    else
        res.sendStatus(404);
});
app.post('/videos', (req, res) => {
    if ((0, validation_1.validation)(req.body).errorsMessages.length) {
        res.status(400).send((0, validation_1.validation)(req.body));
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
    dbVideos.videos.push(newVideo);
    res.status(201).send(newVideo);
});
app.put('/videos/:id', (req, res) => {
    const desiredVideo = dbVideos.videos.find(el => el.id === +req.params.id);
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
app.delete('/videos/:id', (req, res) => {
    if (dbVideos.videos.find(el => el.id === +req.params.id)) {
        dbVideos.videos = dbVideos.videos.filter(el => el.id !== +req.params.id);
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
app.delete('/testing/all-data', (req, res) => {
    dbVideos.videos = [];
    res.sendStatus(204);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
