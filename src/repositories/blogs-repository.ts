import {BlogType, dbBlogs} from "../db/db-blogs";
import {changeBlogNamePosts} from "../helpers/blog-helpers/changeBlogNamePosts";


export const blogsRepository = {
    allBlogs(): Array<BlogType>{
        return dbBlogs.blogs
    },
    createBlog(name: string, description: string, websiteUrl: string): BlogType{
        const createBlog: BlogType = {
            id: `${+new Date()}`,
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }
        dbBlogs.blogs.push(createBlog)
        return createBlog

    },
    findBlog(id: string){
        return dbBlogs.blogs.find(blog =>blog.id===id)
    },
    updateBlog(id: string, name: string, description: string, websiteUrl: string): boolean{
        let foundBlog: BlogType|undefined = dbBlogs.blogs.find(blog=>blog.id ===id)
        if(foundBlog){
            foundBlog.name =  name
            foundBlog.description =  description
            foundBlog.websiteUrl= websiteUrl
            changeBlogNamePosts(id, name)
            return true
        }else{
            return false
        }

    },
    deleteBlog(id: string) : boolean{
        for(let i =0;i<dbBlogs.blogs.length;i++){
            if(dbBlogs.blogs[i].id === id){
                dbBlogs.blogs.splice(i, 1)
                return true
            }
        }
        return false
        }

}