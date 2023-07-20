import mongoose, {HydratedDocument, Model} from "mongoose";
import {PostType, UsersLikes} from "../db/db-posts-type";
import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";
import {ObjectId} from "mongodb";
import {LIKE_STATUS} from "../models/comment-models/EnumLikeStatusModel";


export type HydratedPost = HydratedDocument<PostType, PostMethods>

type PostMethods = {
    updatePost(postDTO: CreateAndUpdatePostModel, blogName: string): void
    userAlreadyLike(userId: ObjectId): UsersLikes | undefined
    createLikeStatus(userId: ObjectId, userLogin: string, likeStatus: LIKE_STATUS): void
    changeLikeStatus(userLike: UsersLikes, likeStatus: LIKE_STATUS): void

}

type PostModel = Model<PostType, {}, PostMethods> & {
    constructPost(postDTO: CreateAndUpdatePostModel, blogName: string): HydratedPost
}


const usersLikesSchema = new mongoose.Schema<UsersLikes>({
    userId: mongoose.Types.ObjectId,
    userLogin: String,
    addedAt: Date,
    likeStatus: String
})

const PostSchema = new mongoose.Schema<PostType, PostModel, PostMethods>({
        title: {type: String, require: true},
        shortDescription: {type: String, require: true},
        content: {type: String, require: true},
        blogId: {type: String, require: true},
        blogName: String,
        createdAt: String,
        likesInfo: {
            likes: {type: Number, default: 0},
            dislikes: {type: Number, default: 0},
            usersLikes: {type: [usersLikesSchema], default: []}
        }
    }
)

PostSchema.method('updatePost', function updatePost(postDTO: CreateAndUpdatePostModel, blogName: string) {
    const that = this as PostType
    that.blogId = new ObjectId(postDTO.blogId)
    that.blogName = blogName
    that.title = postDTO.title
    that.shortDescription = postDTO.shortDescription
    that.content = postDTO.content
})

PostSchema.method('userAlreadyLike', function userAlreadyLike(userId: ObjectId) {

    return this.likesInfo.usersLikes.find((user: UsersLikes) => user.userId.toString() === userId.toString())
})

PostSchema.method('createLikeStatus', function createLikeStatus(userId: ObjectId, userLogin: string, likeStatus: LIKE_STATUS) {
    const that = this as PostType
    const userLike: UsersLikes = {
        userId: userId,
        userLogin: userLogin,
        addedAt: new Date,
        likeStatus: likeStatus
    }
    that.likesInfo.usersLikes.push(userLike)
    if (likeStatus === LIKE_STATUS.LIKE) {
        that.likesInfo.likes += 1
    } else {
        that.likesInfo.dislikes += 1
    }
})

PostSchema.method('changeLikeStatus', function changeLikeStatus(userLike: UsersLikes, likeStatus: LIKE_STATUS) {
    const that = this as PostType
    if (likeStatus === LIKE_STATUS.NONE) {
        that.likesInfo.usersLikes = that.likesInfo.usersLikes.filter(user => user.userId.toString() !== userLike.userId.toString())

        if (userLike.likeStatus === LIKE_STATUS.LIKE) {
            that.likesInfo.likes -= 1
        } else {
            that.likesInfo.dislikes -= 1
        }
    }

    if (likeStatus === LIKE_STATUS.LIKE && likeStatus!==userLike.likeStatus) {
        userLike.likeStatus = likeStatus
        that.likesInfo.likes += 1
        that.likesInfo.dislikes -= 1
    }
    if (likeStatus === LIKE_STATUS.DISLIKE && likeStatus!==userLike.likeStatus) {
        userLike.likeStatus = likeStatus
        that.likesInfo.likes -= 1
        that.likesInfo.dislikes += 1
    }
})


PostSchema.static('constructPost', function constructPost(postDTO: CreateAndUpdatePostModel, blogName: string) {
    const newPost: PostType = new PostType(
        new ObjectId(),
        postDTO.title,
        postDTO.shortDescription,
        postDTO.content,
        new ObjectId(postDTO.blogId),
        blogName,
        new Date().toISOString(),
    )
    return new PostModelClass(newPost)
})


export const PostModelClass = mongoose.model<PostType, PostModel>('Post', PostSchema)
