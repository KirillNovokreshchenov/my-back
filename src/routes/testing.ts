import {Request, Response, Router} from "express";
import {collectionBlogs, collectionPosts, collectionUsers} from "../db/db";
import {dbVideos} from "../db/db-videos";


export const testingRouter = Router()

testingRouter.delete('/all-data', async (req: Request, res: Response)=>{
    dbVideos.videos = []
    const promiseBlogs = collectionBlogs.deleteMany({});
    const promisePosts = collectionPosts.deleteMany({});
    const promiseUsers = collectionUsers.deleteMany({})

    Promise.all([promiseBlogs, promisePosts, promiseUsers])
        .catch((err) => {
            console.error(err);
        });
    res.sendStatus(204)
})