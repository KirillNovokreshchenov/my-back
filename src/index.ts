import {app} from "./app";
import {runDB} from "./db/db";
import mongoose from "mongoose";


const port = 3000

const startApp = async()=>{

    await runDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })

}

startApp()


