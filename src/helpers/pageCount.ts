export function pageCount(totalCount: number, pageSize: number) {
    return Math.ceil(totalCount/pageSize)
}