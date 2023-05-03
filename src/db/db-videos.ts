export type videoType = {
    id: number,
    title:string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number|null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string[]
}


export const dbVideos: { videos: Array<videoType> } = {
    videos: [{
        id: 1,
        title:'string',
        author: 'string',
        canBeDownloaded: true,
        minAgeRestriction: 17,
        createdAt: 'string',
        publicationDate: 'string',
        availableResolutions: ['P720']
    }]
}




