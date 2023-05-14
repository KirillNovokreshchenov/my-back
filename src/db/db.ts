import {MongoClient} from "mongodb";
import {BlogType} from "./db-blogs-type";
import {PostType} from "./db-posts-type";

const uri = process.env.mongoURI || 'mongodb+srv://kirillnovokrest:kirill4022768@cluster0.ngpfdsn.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

const db = client.db('project')
export const collectionBlogs = db.collection<BlogType>('blogs')
export const collectionPosts = db.collection<PostType>('posts')


export async function runDB() {
    try {
        await client.connect();
        await client.db("project").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        //await client.close();
    }
}