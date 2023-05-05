import {Request, Response, Router} from "express";
import {dbVideos} from "../db/db-videos";
import {dbBlogs} from "../db/db-blogs";
import {dbPosts} from "../db/db-posts";


export const testingRouter = Router()

testingRouter.delete('/all-data', (req: Request, res: Response)=>{
    dbVideos.videos = []
    dbBlogs.blogs = []
    dbPosts.posts = []
    res.sendStatus(204)
})