import {Router} from "express";
import {blogValidate} from "../middlewares/blog-middlewares";
import {authorizationValidation} from "../middlewares/auth-middleware";
import {mongoIdMiddleware} from "../middlewares/mongoIdMiddleware";
import {postValidateForBlog} from "../middlewares/post-middleware";
import {blogsController} from "../composition-root";



export const blogRouter = Router()


blogRouter.get('/', blogsController.getBlogs.bind(blogsController))

blogRouter.get('/:id/posts',
    mongoIdMiddleware,
    blogsController.getAllPostsForBlog.bind(blogsController))

blogRouter.post('/',
    blogValidate,
    blogsController.createBlog.bind(blogsController))


blogRouter.post('/:id/posts',
    postValidateForBlog,
    blogsController.createPostForBlog.bind(blogsController))


blogRouter.get('/:id',
    mongoIdMiddleware,
    blogsController.getBlogById.bind(blogsController))

blogRouter.put('/:id',
    blogValidate,
    mongoIdMiddleware,
    blogsController.updateBlog.bind(blogsController)
)

blogRouter.delete('/:id',
    authorizationValidation,
    mongoIdMiddleware,
    blogsController.deleteBlog.bind(blogsController))

