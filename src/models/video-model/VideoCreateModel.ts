

export type VideoCreateAndUpdateModel = {
    id?: number,
    title:string,
    author: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number,
    createdAt?: string,
    publicationDate?: string,
    availableResolutions?: Array<string>

}

