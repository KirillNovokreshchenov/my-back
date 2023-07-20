import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'
import * as mongoose from "mongoose";

dotenv.config()

const dbName = 'MyDB'
const uri = process.env.MONGO_URI
//`mongodb://0.0.0.0:27017/${dbName}`

if(!uri){
    throw new Error('incorrect mongo URL')
}

const client = new MongoClient(uri);

const db = client.db('')



export async function runDB() {
    try {
        await mongoose.connect(uri)
        // await client.connect();
        console.log("You successfully connected to MongoDB!");
    } catch {
        console.log('No connect')
        await mongoose.disconnect()
        await client.close();
    }
}


