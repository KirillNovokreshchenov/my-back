import mongoose from "mongoose";

import {CommentType, LikeStatus} from "../db-comments-type";
import {PostModelClass} from "./schema-post";
import {LIKE_STATUS} from "../../models/comment-models/EnumLikeStatusModel";


const CommentSchema = new mongoose.Schema<CommentType>({
        content: {type: String, require: true},
        commentatorInfo: {
            userId: String,
            userLogin: String,
        },
        createdAt: String,
        postId: String,
        likesInfo: {
            likes: {type: Number, default: 0},
            dislikes: {type: Number, default: 0}
        }
    },
)

export const CommentModelClass = mongoose.model('Comment', CommentSchema, 'CommentsCollection')

const LikeSchema = new mongoose.Schema<LikeStatus>({
    commentId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    likeStatus: String
})

export const LikeStatusClass = mongoose.model('LikeStatus', LikeSchema, 'CommentsCollection')