import {Request,Response, Router} from "express";
import {RESPONSE_STATUS} from "../types/res-status";
import {BlogModelClass} from "../domain/schema-blog";
import {CommentModelClass, LikeStatusClass} from "../domain/schema-comment";
import {PostModelClass} from "../domain/schema-post";
import {RateLimitModelClass} from "../domain/schema-rate-limits";
import {UserModelClass} from "../domain/schema-user";
import {PasswordRecoveryClass} from "../domain/schemas-email";
import {DeviceSessionModelClass} from "../domain/shema-session";


export const testingRouter = Router()



testingRouter.delete('/all-data', async (req: Request, res: Response)=>{
    const deleteBlog = BlogModelClass.deleteMany({})
    const deleteComment = CommentModelClass.deleteMany({})
    const deleteLikeStatus = LikeStatusClass.deleteMany({})
    const deletePost= PostModelClass.deleteMany({})
    const deleteRateLimit = RateLimitModelClass.deleteMany({})
    const deleteUser = UserModelClass.deleteMany({})
    const deletePassword = PasswordRecoveryClass.deleteMany({})
    const deleteDevice = DeviceSessionModelClass.deleteMany({})
    await Promise.all([deleteBlog, deleteComment, deleteLikeStatus, deletePost, deleteRateLimit,deleteUser,deletePassword,deleteDevice])
    res.sendStatus(RESPONSE_STATUS.NO_CONTENT_204)
})
