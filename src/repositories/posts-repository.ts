import {dbPosts, PostType} from "../db/db-posts";
import {findBlogName} from "../helpers/post-helpers/findBlogName";


export const postsRepository = {
    allPosts(): Array<PostType>{
        return dbPosts.posts
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string): PostType{
        const createPost: PostType = {
            id: `${+new Date()}`,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: findBlogName(blogId)
        }
        dbPosts.posts.push(createPost)
        return createPost

    },
    findPost(id: string){
        return dbPosts.posts.find(post =>post.id===id)
    },
    updatePost(id: string, title: string, shortDescription: string, content: string): boolean{
        let foundPost: PostType|undefined = dbPosts.posts.find(post =>post.id===id)
        if(foundPost){
            foundPost.title = title
            foundPost.shortDescription =  shortDescription
            foundPost.content =  content
            return true
        }else{
            return false
        }

    },
    deletePost(id: string): boolean{
        for(let i =0;i<dbPosts.posts.length;i++){
            if(dbPosts.posts[i].id === id){
                dbPosts.posts.splice(i, 1)
                return true
            }

        }
        return false
        }

}