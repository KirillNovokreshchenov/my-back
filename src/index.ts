import express,{Request, Response}from 'express'
import bodyParser from "body-parser";
import {videoRouter} from "./routes/videos";
import {testingRouter} from "./routes/testing";

export const app = express()
const port = 3000


const bodyMiddleware = bodyParser()
app.use(bodyMiddleware)


app.use('/videos', videoRouter)
app.use('/testing', testingRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})