export type VideoType = {
    id: number,
    title:string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number|null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string[]
}
//Videotype[]

export const dbVideos: { videos: VideoType[] } = {
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




