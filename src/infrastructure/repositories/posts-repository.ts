import {PostType} from "../../db/db-posts-type";

import {ObjectId} from "mongodb";
import {formatIdInObjectId} from "../../helpers/format-id-ObjectId";
import {HydratedPost, PostModelClass} from "../../domain/schema-post";
import {PostViewModel} from "../../models/post-models/PostViewModel";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {

    async findPost(id: ObjectId): Promise<HydratedPost | null> {
        return PostModelClass.findOne(id)

    }
    async createPost(createPost: PostType): Promise<ObjectId>{
        await PostModelClass.create(createPost)
        return createPost._id

    }

    async updatePost(postId: ObjectId, title: string, shortDescription: string, content: string, blogId: string, blogName: string): Promise<boolean>{
        const result: any  = await PostModelClass.updateOne({_id: postId}, {$set: {title, shortDescription, content, blogId, blogName}})
        return result.modifiedCount === 1

    }
    async deletePost(id: string): Promise<boolean> {
        const result: any  = await PostModelClass.deleteOne({_id: formatIdInObjectId(id)})
        return result.deletedCount === 1
    }

    async savePost(model: HydratedPost){
       await model.save()
    }

}

