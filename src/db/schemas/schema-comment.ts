import mongoose from "mongoose";

import {CommentType} from "../db-comments-type";
import {PostModelClass} from "./schema-post";


const CommentSchema = new mongoose.Schema<CommentType>({
        content: {type: String, require: true},
        commentatorInfo: {
            userId: String,
            userLogin: String,
        },
        createdAt: String,
        postId: String
    },
)

export const CommentModelClass = mongoose.model('Comment', CommentSchema)