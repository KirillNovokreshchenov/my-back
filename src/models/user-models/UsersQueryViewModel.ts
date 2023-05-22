import {UserViewModel} from "./UserViewModel";

export type UsersQueryViewModel = {
    pagesCount:number
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewModel[]
}