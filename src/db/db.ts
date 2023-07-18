import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'
import * as mongoose from "mongoose";

dotenv.config()

const dbName = 'MyDB'
const uri = process.env.MONGO_URI||`mongodb://0.0.0.0:27017/${dbName}`

if(!uri){
    throw new Error('incorrect mongo URL')
}

const client = new MongoClient(uri);

const db = client.db('')
// export const collectionBlogs = db.collection<BlogType>('blogs')
// export const collectionPosts = db.collection<PostType>('posts')
// export const collectionUsers = db.collection<UserType>('users')
// export const collectionComments = db.collection<CommentType>('comments')
// export const collectionEmail= db.collection<EmailConfirmationType|PasswordRecoveryType>('email')
// export const collectionRefreshTokens = db.collection('blackListRefreshToken')
// export const collectionDevicesAuthSessions = db.collection<DeviceAuthSessionType>('DevicesAuthSessions')
// export const collectionRateLimits = db.collection<RateLimitType>('RateLimits')


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


