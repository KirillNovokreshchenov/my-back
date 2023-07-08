import {ObjectId, WithId} from "mongodb";

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

export class CommentType {
    constructor(
        public _id: ObjectId,
        public content: string,
        public commentatorInfo: CommentatorInfo,
        public createdAt: string,
        public postId: string
    ) {
    }
}
