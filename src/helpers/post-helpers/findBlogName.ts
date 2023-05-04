import {dbBlogs} from "../../db/db-blogs";

export function findBlogName(blogId: string){
    const foundBlog = dbBlogs.blogs.find(blog =>blog.id===blogId)
    return foundBlog!.name
}