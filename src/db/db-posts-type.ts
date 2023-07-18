import {ObjectId} from "mongodb";

// export type PostType = WithId<{
//     title: string
//     shortDescription: string
//     content: string
//     blogId: string
//     blogName: string
//     createdAt: string
// }>

export class PostType {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string
    ) {
    }
}

