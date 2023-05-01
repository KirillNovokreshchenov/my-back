import express from "express";
import bodyParser from "body-parser";
import {videoRouter} from "./routes/videos";
import {testingRouter} from "./routes/testing";

export const app = express()
export const bodyMiddleware = bodyParser()



app.use(bodyMiddleware)


app.use('/videos', videoRouter)
app.use('/testing', testingRouter)
