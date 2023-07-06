import {ObjectId, WithId} from "mongodb";

export type CommentType = WithId<{
    content: string
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    postId: string
}>
