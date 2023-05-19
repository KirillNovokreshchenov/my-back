import {BlogViewModel} from "./BlogViewModel";

export type BlogQueryViewModel = {
    pagesCount:number
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[]
}