export type PostQueryViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [
        {
            id: string
            title: string
            shortDescription: string
            content: string
            blogId: string
            blogName: string
            createdAt: string
        }
    ]
}