import {PostViewModel} from "./PostViewModel";

export type PostQueryViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostViewModel[]
}