import {ObjectId, WithId} from "mongodb";


export type BlogType = WithId<{
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}>

