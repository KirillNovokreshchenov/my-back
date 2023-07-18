import "reflect-metadata"
import {UsersRepository} from "./infrastructure/repositories/users-repository";
import {UsersQueryRepository} from "./infrastructure/repositories/query-repositories/query-users-repository";
import {EmailManagers} from "./application/managers/email-managers";
import {UsersController} from "./controllers/user-controller";
import {UsersService} from "./application/users-service";
import {SessionsRepository} from "./infrastructure/repositories/sessions-repository";
import {JwtService} from "./application/jwt-service";
import {AuthController} from "./controllers/auth-controller";
import {DeviceController} from "./controllers/security-device-controller";
import {QueryBlogsRepository} from "./infrastructure/repositories/query-repositories/query-blogs-repository";
import {BlogsRepository} from "./infrastructure/repositories/blogs-repository";
import {PostsQueryRepository} from "./infrastructure/repositories/query-repositories/query-posts-repository";
import {BlogsService} from "./application/blogs-service";
import {BlogsController} from "./controllers/blog-controller";
import {PostsRepository} from "./infrastructure/repositories/posts-repository";
import {PostsService} from "./application/posts-service";
import {PostsController} from "./controllers/post-controller";
import {QueryCommentsRepository} from "./infrastructure/repositories/query-repositories/query-comments-repository";
import {CommentsRepository} from "./infrastructure/repositories/comments-repository";
import {CommentsService} from "./application/comments-service";
import {CommentsController} from "./controllers/comment-controller";
import {EmailAdapter} from "./infrastructure/adapters/email-adapter";
import {JwtAdapter} from "./infrastructure/adapters/jwt-adapter";
import {Container} from "inversify";


export const iocContainer = new Container()

iocContainer.bind(UsersRepository).to(UsersRepository)
iocContainer.bind(UsersQueryRepository).to(UsersQueryRepository)
iocContainer.bind(SessionsRepository).to(SessionsRepository)
iocContainer.bind(QueryBlogsRepository).to(QueryBlogsRepository)
iocContainer.bind(BlogsRepository).to(BlogsRepository)
iocContainer.bind(PostsQueryRepository).to(PostsQueryRepository)
iocContainer.bind(PostsRepository).to(PostsRepository)
iocContainer.bind(QueryCommentsRepository).to(QueryCommentsRepository)
iocContainer.bind(CommentsRepository).to(CommentsRepository)

iocContainer.bind(EmailAdapter).to(EmailAdapter)
iocContainer.bind(JwtAdapter).to(JwtAdapter)
iocContainer.bind(EmailManagers).to(EmailManagers)

iocContainer.bind(JwtService).to(JwtService)
iocContainer.bind(UsersService).to(UsersService)
iocContainer.bind(BlogsService).to(BlogsService)
iocContainer.bind(PostsService).to(PostsService)
iocContainer.bind(CommentsService).to(CommentsService)


iocContainer.bind(UsersController).to(UsersController)
iocContainer.bind(AuthController).to(AuthController)
iocContainer.bind(DeviceController).to(DeviceController)
iocContainer.bind(BlogsController).to(BlogsController)
iocContainer.bind(PostsController).to(PostsController)
iocContainer.bind(CommentsController).to(CommentsController)




