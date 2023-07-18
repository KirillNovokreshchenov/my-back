import {BlogType} from "../db/db-blogs-type";
import mongoose from "mongoose";


const BlogSchema = new mongoose.Schema<BlogType>({
        name: {type: String, require: true},
        description: {type: String, require: true},
        websiteUrl: {type: String, require: true},
        createdAt: String,
        isMembership: Boolean

    },
)


export const BlogModelClass = mongoose.model('Blog', BlogSchema)
