export type BlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}

export const dbBlogs: {blogs: Array<BlogType>} = {
    blogs:[
        {
            id: '1',
            name: 'babylon',
            description:'Ancient Babylon blog',
            websiteUrl: 'https://babylon.com'
        },
        {
            id: '2',
            name: 'rome',
            description:'Ancient Rome blog',
            websiteUrl: 'https://rome.com'
        }
    ]
}