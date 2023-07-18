import mongoose from "mongoose";
import {PostType} from "../db/db-posts-type";


const PostSchema = new mongoose.Schema<PostType>({
        title: {type: String, require: true},
        shortDescription: {type: String, require: true},
        content: {type: String, require: true},
        blogId: {type: String, require: true},
        blogName: String,
        createdAt: String,
    },
)


export const PostModelClass = mongoose.model('Post', PostSchema)
