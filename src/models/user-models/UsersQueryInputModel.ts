export type UsersQueryInputModel = {
    searchLoginTerm?: string|null
    searchEmailTerm?: string|null
    sortBy?: string
    sortDirection?: string
    pageNumber?: number
    pageSize?: number
}