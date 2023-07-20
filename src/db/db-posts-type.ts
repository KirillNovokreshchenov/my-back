import {ObjectId} from "mongodb";
import {LIKE_STATUS} from "../models/comment-models/EnumLikeStatusModel";


export type UsersLikes = {
    userId: ObjectId
    userLogin: string
    addedAt: Date
    likeStatus: LIKE_STATUS
}

type PostLikesInfo = {
    likes: number
    dislikes: number
    usersLikes: UsersLikes[]
}

export class PostType {
    public likesInfo: PostLikesInfo
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: ObjectId,
        public blogName: string,
        public createdAt: string
    ) {
        this.likesInfo = {
            likes: 0,
            dislikes: 0,
            usersLikes:[]
        }
    }
}

