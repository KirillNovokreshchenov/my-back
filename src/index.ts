import {app} from "./app";
import {runDB} from "./db/db";
import {CommentModelClass} from "./db/schemas/schema-comment";
import {CommentType} from "./db/db-comments-type";


const port = 3000

const startApp = async()=>{

    await runDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })

}

startApp()

