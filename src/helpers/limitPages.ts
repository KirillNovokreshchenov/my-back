export function limitPages(pageNumber:number, pageSize: number){
    return (+pageNumber-1)*(+pageSize)
}