import {Request, Response, Router} from "express";
import {collectionBlogs, collectionPosts} from "../db/db";


export const testingRouter = Router()

testingRouter.delete('/all-data', async (req: Request, res: Response)=>{
    await collectionBlogs.deleteMany({})
    await collectionPosts.deleteMany({})
    res.sendStatus(204)
})