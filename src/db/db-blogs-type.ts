import {ObjectId} from "mongodb";


// export type BlogType = WithId<{
//     name: string
//     description: string
//     websiteUrl: string
//     createdAt: string
//     isMembership: boolean
// }>

export class BlogType {
    constructor(
        public _id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean
    ) {
    }
}

