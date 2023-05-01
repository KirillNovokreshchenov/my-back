import {Request, Response, Router} from "express";
import {VideoViewModel} from "../models/VideoViewModel";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types";
import {URIParamsId} from "../models/URIParamsIdModel";
import {VideosCreateAndUpdateModel} from "../models/VideoCreateModel";
import {errorsMessages, validation} from "../helpers/validation";
import {publicationDate} from "../helpers/publicationDate";
import {videoUpdate} from "../helpers/videoUpdate";


export const dbVideos: { videos: Array<videoType> } = {
    videos: [{
        id: 1,
        title:'string',
        author: 'string',
        canBeDownloaded: true,
        minAgeRestriction: 34,
        createdAt: 'string',
        publicationDate: 'string',
        availableResolutions: ['P720']
    }]
}

type videoType = {
    id: number,
    title:string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number|null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string[]
}

export const videoRouter = Router()
videoRouter.get('/', (req: Request, res: Response<VideoViewModel[]>)=>{
    res.send(dbVideos.videos)
})
videoRouter.get('/:id', (req:RequestWithParams<URIParamsId>, res:Response<VideoViewModel>)=>{
    let video = dbVideos.videos.find(el=>el.id===+req.params.id)
    if(video){
        res.send(video)
    } else res.sendStatus(404)
})
videoRouter.post('/', (req: RequestWithBody<VideosCreateAndUpdateModel>, res: Response<errorsMessages|VideoViewModel>) => {
    if(validation(req.body).errorsMessages.length) {
        res.status(400).send(validation(req.body))
        return
    }
    const newVideo: videoType = {
        id:req.body.id || +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded||false,
        minAgeRestriction:req.body.minAgeRestriction|| null,
        createdAt: req.body.createdAt||new Date().toISOString(),
        publicationDate: req.body.publicationDate||publicationDate(),
        availableResolutions: req.body.availableResolutions||[]
    }


    dbVideos.videos.push(newVideo)
    res.status(201).send(newVideo)


})
videoRouter.put('/:id', (req: RequestWithBodyAndParams<URIParamsId, VideosCreateAndUpdateModel>, res: Response<errorsMessages|VideoViewModel>)=>{
    const desiredVideo = dbVideos.videos.find(el=>el.id===+req.params.id)
    if(desiredVideo){
        if(validation(req.body).errorsMessages.length){
            res.status(400).send(validation(req.body))
        } else {
            videoUpdate(desiredVideo, req.body)
            res.sendStatus(204)
        }
    } else res.sendStatus(404)
})
videoRouter.delete('/:id', (req:RequestWithParams<URIParamsId>, res:Response)=>{
    if(dbVideos.videos.find(el=>el.id===+req.params.id)){
        dbVideos.videos = dbVideos.videos.filter(el=>el.id!==+req.params.id)
        res.sendStatus(204)

    } else {
        res.sendStatus(404)
    }


})