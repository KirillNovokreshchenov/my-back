import {collectionBlogs} from "../../db/db";
import {BSON} from "mongodb";


export async function findBlogName(blogId: string){
    const objId = new BSON.ObjectId(blogId)
    const foundBlog = await collectionBlogs.findOne({_id: objId})
    return foundBlog!.name
}