import {dbPosts} from "../../db/db-posts";

export function changeBlogNamePosts(id: string, name:string){
    dbPosts.posts.filter(post =>post.blogId === id).forEach(post=>{
        post.blogName = name
    })
}