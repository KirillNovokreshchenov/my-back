import {collectionPosts} from "../../db/db";

export async function changeBlogNamePosts(id: string, name:string){
 await collectionPosts.updateMany({blogId: id}, {$set:{blogName: name}})
}