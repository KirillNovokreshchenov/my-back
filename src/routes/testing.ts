import {Request, Response, Router} from "express";
import {collectionBlogs, collectionPosts} from "../db/db";
import {dbVideos} from "../db/db-videos";


export const testingRouter = Router()

testingRouter.delete('/all-data', async (req: Request, res: Response)=>{
    dbVideos.videos = []
    await collectionBlogs.deleteMany({})
    await collectionPosts.deleteMany({})
    res.sendStatus(204)
})