import mongoose, {Model, model, InferSchemaType} from "mongoose";
import {UserType} from "../db-users-type";
import {limitPages} from "../../helpers/limitPages";


const UserSchema = new mongoose.Schema<UserType>({
        login: {type: String, require: true},
        password: {type: String, require: true},
        email: {type: String, require: true},

    },
    {
        timestamps: {createdAt: true, updatedAt: false}
    }
)



export const UserModelClass = mongoose.model('User', UserSchema)

