import {dbBlogs} from "../db/db-blogs";

export const blogsRepository = {
    allBlogs(){
        return dbBlogs.blogs
    },
    createBlog(name: string, description: string, websiteUrl: string){
        const createBlog = {
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
    updateBlog(id: string, name: string, description: string, websiteUrl: string){
        let foundBlog = dbBlogs.blogs.find(blog=>blog.id ===id)
        if(foundBlog){
            foundBlog.id = id
            foundBlog.name =  name
            foundBlog.description =  description
            foundBlog.websiteUrl= websiteUrl
            return true
        }else{
            return false
        }

    },
    deleteBlog(id: string){
        for(let i =0;i<dbBlogs.blogs.length;i++){
            if(dbBlogs.blogs[i].id === id){
                dbBlogs.blogs.splice(i, 1)
                return true
            }

        }
        return false
        }

}