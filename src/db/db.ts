import {MongoClient} from "mongodb";
import {BlogType} from "./db-blogs-type";
import {PostType} from "./db-posts-type";
import * as dotenv from 'dotenv'
import {DeviceAuthSession, EmailConfirmationType, PasswordRecoveryType, RateLimit, UserType} from "./db-users-type";
import {CommentType} from "./db-comments-type";
import * as mongoose from "mongoose";
import {settings} from "../settings";
dotenv.config()

const dbName = 'MyDB'
const uri = process.env.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`

if(!uri){
    throw new Error('incorrect mongo URL')
}

const client = new MongoClient(uri);

const db = client.db('')
export const collectionBlogs = db.collection<BlogType>('blogs')
export const collectionPosts = db.collection<PostType>('posts')
export const collectionUsers = db.collection<UserType>('users')
export const collectionComments = db.collection<CommentType>('comments')
export const collectionEmail= db.collection<EmailConfirmationType|PasswordRecoveryType>('email')
export const collectionRefreshTokens = db.collection('blackListRefreshToken')
export const collectionDevicesAuthSessions = db.collection<DeviceAuthSession>('DevicesAuthSessions')
export const collectionRateLimits = db.collection<RateLimit>('RateLimits')


export async function runDB() {
    try {
        await mongoose.connect(uri)
        await client.connect();
        console.log("You successfully connected to MongoDB!");
    } catch {
        console.log('No connect')
        await mongoose.disconnect()
        await client.close();
    }
}


