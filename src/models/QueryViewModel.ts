export type QueryViewModel<I> = {
    pagesCount:number
    page: number
    pageSize: number
    totalCount: number
    items:I[]
}