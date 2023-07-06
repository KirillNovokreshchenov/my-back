import {ObjectId, WithId} from "mongodb";

export type PostType = WithId<{
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}>

