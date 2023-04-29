import {Request, Response, Router} from "express";
import {dbVideos} from "./videos";

export const testingRouter = Router()

testingRouter.delete('/all-data', (req: Request, res: Response)=>{
    dbVideos.videos = []
    res.sendStatus(204)
})