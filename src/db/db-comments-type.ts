import {ObjectId} from "mongodb";

export type CommentType = {
    _id: ObjectId
    content: string
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}
