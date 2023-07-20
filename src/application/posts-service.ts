import {CreateAndUpdatePostModel} from "../models/post-models/CreateAndUpdatePostModel";
import {PostsRepository} from "../infrastructure/repositories/posts-repository";
import {ObjectId} from "mongodb";
import {PostType} from "../db/db-posts-type";
import {BlogsRepository} from "../infrastructure/repositories/blogs-repository";
import {BlogType} from "../db/db-blogs-type";
import {inject, injectable} from "inversify";
import {PostModelClass} from "../domain/schema-post";
import {LIKE_STATUS} from "../models/comment-models/EnumLikeStatusModel";

@injectable()
export class PostsService {

    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(BlogsRepository) protected blogsRepository: BlogsRepository
    ) {

    }

    async createPost(postDTO: CreateAndUpdatePostModel): Promise<ObjectId | null> {

        const foundBlogName = await this.blogsRepository.findBlog(new ObjectId(postDTO.blogId))
        if (!foundBlogName) {
            return null
        }
        const newPost = PostModelClass.constructPost(postDTO, foundBlogName.name)

        await this.postsRepository.savePost(newPost)

        return newPost._id


    }

    async updatePost(postId: string, postDTO: CreateAndUpdatePostModel): Promise<boolean> {

        const blog: BlogType | null = await this.blogsRepository.findBlog(new ObjectId(postDTO.blogId))
        if (!blog) return false

        const existingPost = await this.postsRepository.findPost(new ObjectId(postId))
        if (!existingPost) return false

        existingPost.updatePost(postDTO, blog.name)

        await this.postsRepository.savePost(existingPost)
        return true
    }


    async deletePost(id: string): Promise<boolean> {
        return await this.postsRepository.deletePost(id)
    }


    async updateLike(postId: ObjectId, userId: ObjectId, userLogin: string, likeStatus: LIKE_STATUS): Promise<boolean> {

        const post = await this.postsRepository.findPost(postId)
        if (!post) return false

        const userLikes = post.userAlreadyLike(userId)


        if (!userLikes) {
            post.createLikeStatus(userId, userLogin, likeStatus)
        } else {
            post.changeLikeStatus(userLikes, likeStatus)
        }

        await this.postsRepository.savePost(post)
        return true
    }

}

