import {Request, Response, Router} from "express";
import {
    collectionBlogs,
    collectionComments,
    collectionEmailConfirmations,
    collectionPosts,
    collectionUsers
} from "../db/db";
import {dbVideos} from "../db/db-videos";
import {RESPONSE_STATUS} from "../types/resStatus";


export const testingRouter = Router()

testingRouter.delete('/all-data', async (req: Request, res: Response)=>{
    dbVideos.videos = []
    const promiseBlogs = collectionBlogs.deleteMany({});
    const promisePosts = collectionPosts.deleteMany({});
    const promiseUsers = collectionUsers.deleteMany({})
    const promiseComments = collectionComments.deleteMany({})
    const promiseEmailConfirmations = collectionEmailConfirmations.deleteMany({})

    await Promise.all([promiseBlogs, promisePosts, promiseUsers, promiseComments, promiseEmailConfirmations])
        .catch((err) => {
            console.error(err);
        });
    res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
})