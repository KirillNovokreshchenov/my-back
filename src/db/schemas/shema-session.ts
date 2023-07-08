
import mongoose from "mongoose";
import {DeviceAuthSessionType} from "../db-users-type";
import {ObjectId} from "mongodb";


const DeviceSessionSchema = new mongoose.Schema<DeviceAuthSessionType>({
    userId: ObjectId,
    ip: String,
    title: String,
    lastActiveDate: Date,
    expDate: Date,
    deviceId: String
    },
)


export const DeviceSessionModelClass = mongoose.model('DeviceSession', DeviceSessionSchema)
