export type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

export const dbPosts: {posts: Array<PostType>} = {
    posts:[
        {
            "id": "1",
            "title": "babylon empire",
            "shortDescription": "the history of the Babylonian empire",
            "content": "Babylon is the name of an ancient city located on the lower Euphrates river in southern Mesopotamia",
            "blogId": "1",
            "blogName": "babylon"
        }

    ]
}