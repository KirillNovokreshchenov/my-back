import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {UserType} from "../db/db-users-type";
import {EmailConfirmationSchema} from "./schemas-email";
import {uuid} from "uuidv4";
import {add} from "date-fns";
import bcrypt from "bcrypt";


export type UserMethods = {
    confirm(): void
    compareHash(password: string, hash: string): Promise<boolean>
    canBeConfirmed(): boolean
}


type UserModel = Model<UserType, {}, UserMethods> & {
    constructUser(login: string, email: string, password: string): Promise<HydratedDocument<UserType, UserMethods>>
    createHash(password: string): Promise<string>
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

UserSchema.method('compareHash', async function compareHash(password: string, hash: string) {
    const isTrue = await bcrypt.compare(password, hash)
    return isTrue
})

UserSchema.method('canBeConfirmed', function canBeConfirmed() {
    return this.emailConfirmation.expirationDate > new Date()&&this.emailConfirmation.isConfirmed!==true

})


UserSchema.static('createHash', function createHash(password: string) {
    const hash = bcrypt.hash(password, 10)
    return hash
})

UserSchema.static('constructUser', async function constructUser(login: string, email: string, password: string) {
    const hash = await this.createHash(password)
    const newUser = new UserType(
        new mongoose.Types.ObjectId(),
        login,
        email,
        hash,
        new Date().toISOString(),
        {
            confirmationCode: uuid(),
            expirationDate: add(new Date(), {
                hours: 1
            }),
            isConfirmed: false
        })
    return new UserModelClass(newUser)

})


export const UserModelClass = mongoose.model<UserType, UserModel>('User', UserSchema)

