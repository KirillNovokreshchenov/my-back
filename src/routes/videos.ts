import {Request, Response, Router} from "express";
import {VideoViewModel} from "../models/video-model/VideoViewModel";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {VideoCreateAndUpdateModel} from "../models/video-model/VideoCreateModel";
import {validation} from "../helpers/videoHelpers/validation";
import {publicationDate} from "../helpers/videoHelpers/publicationDate";
import {videoUpdate} from "../helpers/videoHelpers/videoUpdate";
import {dbVideos, VideoType} from "../db/db-videos";
import {errorsMessages} from "../models/ErrorModel";


export const videoRouter = Router()
videoRouter.get('/', (req: Request, res: Response<VideoViewModel[]>) => {
    res.send(dbVideos.videos)
})
videoRouter.get('/:id([0-9]+)', (req: RequestWithParams<URIParamsId>, res: Response<VideoViewModel>) => {
    let video = dbVideos.videos.find(el => el.id === +req.params.id)
    if (video) {
        res.send(video)
    } else res.sendStatus(404)
})
videoRouter.post('/', (req: RequestWithBody<VideoCreateAndUpdateModel>, res: Response<errorsMessages | VideoViewModel>) => {
    const errors = validation(req.body)
    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }
    const newVideo: VideoType = {
        id: req.body.id || +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded || false,
        minAgeRestriction: req.body.minAgeRestriction || null,
        createdAt: req.body.createdAt || new Date().toISOString(),
        publicationDate: req.body.publicationDate || publicationDate(),
        availableResolutions: req.body.availableResolutions || []
    }


    dbVideos.videos.push(newVideo)
    res.status(201).send(newVideo)


})
videoRouter.put('/:id([0-9]+)', (req: RequestWithBodyAndParams<URIParamsId, VideoCreateAndUpdateModel>, res: Response<errorsMessages | VideoViewModel>) => {
    const foundVideo = dbVideos.videos.find(el => el.id === +req.params.id)
    if (foundVideo) {
        if (validation(req.body).errorsMessages.length) {
            res.status(400).send(validation(req.body))
        } else {
            videoUpdate(foundVideo, req.body)
            res.sendStatus(204)
        }
    } else res.sendStatus(404)
})
videoRouter.delete('/:id([0-9]+)', (req: RequestWithParams<URIParamsId>, res: Response) => {
    if (dbVideos.videos.find(el => el.id === +req.params.id)) {
        dbVideos.videos = dbVideos.videos.filter(el => el.id !== +req.params.id)
        res.sendStatus(204)

    } else {
        res.sendStatus(404)
    }


})