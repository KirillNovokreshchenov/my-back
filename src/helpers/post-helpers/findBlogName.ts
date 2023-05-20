import {collectionBlogs} from "../../db/db";
import {BSON} from "mongodb";
import {formatIdInObjectId} from "../format-id-ObjectId";


export async function findBlogName(blogId: string){
    const foundBlog = await collectionBlogs.findOne({_id: formatIdInObjectId(blogId)})
    return foundBlog!.name
}