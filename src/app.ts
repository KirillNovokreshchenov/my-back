import express from "express";
import bodyParser from "body-parser";
import {videoRouter} from "./routes/videos";
import {testingRouter} from "./routes/testing";
import {blogRouter} from "./routes/blogs";
import {postRouter} from "./routes/posts";

export const app = express()
export const bodyMiddleware = bodyParser()
app.use(bodyMiddleware)


app.use('/videos', videoRouter)
app.use('/testing', testingRouter)
app.use('/blogs', blogRouter)
app.use('/posts', postRouter)
