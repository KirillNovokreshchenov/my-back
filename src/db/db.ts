import {MongoClient} from "mongodb";
import {BlogType} from "./db-blogs-type";
import {PostType} from "./db-posts-type";

import * as dotenv from 'dotenv'
dotenv.config()

const uri = process.env.MONGO_URI
if(!uri){
    throw new Error('incorrect mongo URL')
}

const client = new MongoClient(uri);

const db = client.db('')
export const collectionBlogs = db.collection<BlogType>('blogs')
export const collectionPosts = db.collection<PostType>('posts')

export async function runDB() {
    try {
        await client.connect();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {
        console.log('No connect')
        await client.close();
    }
}