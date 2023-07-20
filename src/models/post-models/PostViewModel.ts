import {LIKE_STATUS} from "../comment-models/EnumLikeStatusModel";

export type  NewestLikes = {
    addedAt: Date,
    userId: string,
    login: string
}
export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LIKE_STATUS,
        newestLikes: NewestLikes[]
    }
}