import {Request, Response, Router} from "express";
import {dbVideos} from "../db/db";


export const testingRouter = Router()

testingRouter.delete('/all-data', (req: Request, res: Response)=>{
    dbVideos.videos = []
    res.sendStatus(204)
})