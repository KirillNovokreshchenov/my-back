export type BlogQueryViewModel = {
    pagesCount:number
    page: number,
    pageSize: number,
    totalCount: number,
    items: [
        {
            id: string
            name: string
            description: string
            websiteUrl: string
            createdAt: string
            isMembership: boolean
        }
    ]
}