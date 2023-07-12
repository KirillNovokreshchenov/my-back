import {ObjectId} from "mongodb";
import {LIKE_STATUS} from "./EnumLikeStatusModel";

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number
        myStatus: LIKE_STATUS
    }
}