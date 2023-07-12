import {ObjectId, WithId} from "mongodb";
import {LIKE_STATUS} from "../models/comment-models/EnumLikeStatusModel";

// export type CommentType = WithId<{
//     content: string
//     commentatorInfo: {
//         userId: string,
//         userLogin: string
//     },
//     createdAt: string,
//     postId: string
// }>

type CommentatorInfo = {
    userId: string,
    userLogin: string
}

type LikesInfo = {
    likes: number,
    dislikes: number
}
export class CommentType {
    public likesInfo: LikesInfo
    constructor(
        public _id: ObjectId,
        public content: string,
        public commentatorInfo: CommentatorInfo,
        public createdAt: string,
        public postId: string,
    ) {
        this.likesInfo = {
            likes: 0,
            dislikes: 0
        }
    }
}

export class LikeStatus {
    constructor(
        public _id: ObjectId,
        public commentId: ObjectId,
        public userId: ObjectId,
        public likeStatus: LIKE_STATUS,
    ) {
    }
}
