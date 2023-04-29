import express,{Request, Response}from 'express'
import bodyParser from "body-parser";
import {publicationDate} from "./helpers/publicationDate";
import {VideosCreateAndUpdateModel} from "./models/VideoCreateModel";
import {errorsMessages, validation} from "./helpers/validation";
import {videoUpdate} from "./helpers/videoUpdate";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "./types";
import {VideoViewModel} from "./models/VideoViewModel";
import {URIParamsId} from "./models/URIParamsIdModel";

const app = express()
const port = 3000

const dbVideos: { videos: Array<videoType> } = {
    videos: []
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


const bodyMiddleware = bodyParser()
app.use(bodyMiddleware)




app.get('/videos', (req: Request, res: Response<VideoViewModel[]>)=>{
    res.send(dbVideos.videos)
})
app.get('/videos/:id', (req:RequestWithParams<URIParamsId>, res:Response<VideoViewModel>)=>{
    let video = dbVideos.videos.find(el=>el.id===+req.params.id)
    if(video){
        res.send(video)
    } else res.sendStatus(404)
})
app.post('/videos', (req: RequestWithBody<VideosCreateAndUpdateModel>, res: Response<errorsMessages|VideoViewModel>) => {
    if(validation(req.body).errorsMessages.length) {
        res.status(400).send(validation(req.body))
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
app.put('/videos/:id', (req: RequestWithBodyAndParams<URIParamsId, VideosCreateAndUpdateModel>, res: Response<errorsMessages|VideoViewModel>)=>{
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
app.delete('/videos/:id', (req:RequestWithParams<URIParamsId>, res:Response)=>{
    if(dbVideos.videos.find(el=>el.id===+req.params.id)){
        dbVideos.videos = dbVideos.videos.filter(el=>el.id!==+req.params.id)
        res.sendStatus(204)

    } else {
        res.sendStatus(404)
    }


})
app.delete('/testing/all-data', (req: Request, res: Response)=>{
    dbVideos.videos = []
    res.sendStatus(204)
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})