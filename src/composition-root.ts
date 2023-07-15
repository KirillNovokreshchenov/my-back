import {UsersRepository} from "./repositories/users-repository";
import {UsersQueryRepository} from "./repositories/query-users-repository";
import {EmailManagers} from "./managers/email-managers";
import {UsersController} from "./controllers/user-controller";
import {UsersService} from "./domain/users-service";
import {SessionsRepository} from "./repositories/sessions-repository";
import {JwtService} from "./application/jwt-service";
import {AuthController} from "./controllers/auth-controller";
import {DeviceController} from "./controllers/security-device-controller";
import {QueryBlogsRepository} from "./repositories/query-blogs-repository";
import {BlogsRepository} from "./repositories/blogs-repository";
import {PostsQueryRepository} from "./repositories/query-posts-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./controllers/blog-controller";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./controllers/post-controller";
import {QueryCommentsRepository} from "./repositories/query-comments-repository";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./controllers/comment-controller";
import {EmailAdapter} from "./adapters/email-adapter";
import {JwtAdapter} from "./adapters/jwt-adapter";




const usersRepository = new UsersRepository()
const usersQueryRepository = new UsersQueryRepository()
const emailAdapter = new EmailAdapter()
const sessionsRepository = new SessionsRepository()
const blogsQueryRepository = new QueryBlogsRepository()
const blogsRepository = new BlogsRepository()
const postsQueryRepository = new PostsQueryRepository()
const postsRepository = new PostsRepository()
const queryCommentsRepository = new QueryCommentsRepository()
const commentsRepository = new CommentsRepository()
const jwtAdapter = new JwtAdapter()


const emailManagers = new EmailManagers(emailAdapter)

const usersService = new UsersService(usersRepository, emailManagers)
export const jwtService = new JwtService(sessionsRepository, usersRepository, jwtAdapter)
const blogsService = new BlogsService( blogsRepository)
const postsService = new PostsService(postsRepository, blogsRepository)
const commentsService = new CommentsService(commentsRepository, postsRepository)


export const usersController = new UsersController(usersService, usersQueryRepository)
export const authController = new AuthController(usersService, jwtService, usersQueryRepository)
export const deviceController = new DeviceController(usersQueryRepository, jwtService)
export const blogsController = new BlogsController(blogsQueryRepository, blogsService, postsQueryRepository)
export const postsController = new PostsController(postsQueryRepository, postsService, commentsService, queryCommentsRepository)
export const commentsController = new CommentsController( queryCommentsRepository, commentsService)