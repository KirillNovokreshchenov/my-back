import {collectionBlogs} from "../../db/db";


export async function findBlogName(blogId: string){
    const foundBlog = await collectionBlogs.findOne({id: blogId})
    return foundBlog!.name
}