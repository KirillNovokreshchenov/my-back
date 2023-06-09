import {Request, Response, Router} from "express";
import {
    collectionBlogs,
    collectionComments, collectionDevicesAuthSessions,
    collectionEmail,
    collectionPosts, collectionRateLimits,
    collectionUsers
} from "../db/db";
import {dbVideos} from "../db/db-videos";
import {RESPONSE_STATUS} from "../types/res-status";


export const testingRouter = Router()



testingRouter.delete('/all-data', async (req: Request, res: Response)=>{
    dbVideos.videos = []
    const promiseBlogs = collectionBlogs.deleteMany({});
    const promisePosts = collectionPosts.deleteMany({});
    const promiseUsers = collectionUsers.deleteMany({})
    const promiseComments = collectionComments.deleteMany({})
    const promiseEmailConfirmations = collectionEmail.deleteMany({})
    const promiseDeviceAuth = collectionDevicesAuthSessions.deleteMany({})
    const promiseRiteLimit = collectionRateLimits.deleteMany({})

    await Promise.all([promiseBlogs, promisePosts, promiseUsers, promiseComments, promiseEmailConfirmations, promiseDeviceAuth,promiseRiteLimit])
        .catch((err) => {
            console.error(err);
        });
    res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
})