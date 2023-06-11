import express from "express";
import bodyParser from "body-parser";
import {videoRouter} from "./routes/videos";
import {testingRouter} from "./routes/testing";
import {blogRouter} from "./routes/blogs";
import {postRouter} from "./routes/posts";
import {userRouter} from "./routes/users";
import {authRouter} from "./routes/auth";
import {commentRouter} from "./routes/comments";
import cookieParser from "cookie-parser";



export const app = express()
// export const bodyMiddleware = bodyParser()
app.use(express.json())
app.use(cookieParser())

app.use('/videos', videoRouter)
app.use('/testing', testingRouter)
app.use('/blogs', blogRouter)
app.use('/posts', postRouter)
app.use('/users',userRouter)
app.use('/auth', authRouter)
app.use('/comments', commentRouter)

