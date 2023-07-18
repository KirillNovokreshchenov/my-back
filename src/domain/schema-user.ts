import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {UserType} from "../db/db-users-type";
import {EmailConfirmationSchema} from "./schemas-email";
import {uuid} from "uuidv4";
import {add} from "date-fns";




export type UserMethods = {
    confirm(): void
}

// type UserMethodsType = Model<UserType, {}, UserMethods>
//
//
// type UserStaticType = Model<UserType> & {
//     constructUser(login: string,email: string,passwordHash: string): HydratedDocument<UserType, UserMethods>
// }
//
// type FullUserModelType = UserMethodsType&UserStaticType
//
// // export type HydratedUser = HydratedDocument<UserType, UserMethods>

type UserModel =  Model<UserType, {}, UserMethods> &{
    createWithFullName(name: string): Promise<HydratedDocument<UserType, UserMethods>>;
}

const UserSchema = new mongoose.Schema<UserType, UserModel, UserMethods>({
        login: {type: String, require: true},
        password: {type: String, require: true},
        email: {type: String, require: true},
        emailConfirmation: EmailConfirmationSchema

    },
    {
        timestamps: {createdAt: true, updatedAt: false}
    }
)


UserSchema.method('confirm', function confirm() {
    const that = this as UserType
    that.emailConfirmation.isConfirmed = true
})

UserSchema.static('constructUser', function constructUser(login: string,email: string,passwordHash: string) {
    const newUser = new UserType(
        new mongoose.Types.ObjectId(),
        login,
        email,
        passwordHash,
        new Date().toISOString(),
        {
            confirmationCode: uuid(),
            expirationDate: add(new Date(), {
                hours: 1
            }),
            isConfirmed: false
        }
    )
    return newUser as UserType
})

export const UserModelClass = mongoose.model<UserType, UserModel>('User', UserSchema)

