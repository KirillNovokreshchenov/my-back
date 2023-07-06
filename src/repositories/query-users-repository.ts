import {ObjectId, Sort} from "mongodb";
import {UserViewModel} from "../models/user-models/UserViewModel";
import {collectionDevicesAuthSessions, collectionEmail, collectionUsers} from "../db/db";
import {EmailConfirmationType, UserType} from "../db/db-users-type";
import {UsersQueryInputModel} from "../models/user-models/UsersQueryInputModel";
import {pageCount} from "../helpers/pageCount";
import {limitPages} from "../helpers/limitPages";
import {QueryViewModel} from "../models/QueryViewModel";
import {DataViewByToken} from "../models/auth-models/DataViewByToken";
import {UserModelClass} from "../db/schemas/schema-user";

export const usersQueryRepository = {

    async allUsers(userQuery: UsersQueryInputModel): Promise<QueryViewModel<UserViewModel>> {
        const {
            searchLoginTerm = null,
            searchEmailTerm = null,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10
        } = userQuery



        const totalCount = await UserModelClass.countDocuments(this._sortedLoginEmail(searchLoginTerm, searchEmailTerm))


        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: await UserModelClass
                .find(this._sortedLoginEmail(searchLoginTerm, searchEmailTerm))
                .sort(sortDirection ==='asc'? `${sortBy}`: `-${sortBy}`)
                .skip(limitPages(+pageNumber, +pageSize))
                .limit(+pageSize)
                .lean()
                .then((users)=>{
                    return Array.from(users).map((user: UserType) => this._mapUser(user))
                })
        }
    },

    async findUser(id: ObjectId): Promise<UserViewModel|null> {
        const foundUser = await UserModelClass.findOne(id).lean()
        if(!foundUser) return null
        return this._mapUser(foundUser)


    },
    async findUserWithToken(id: ObjectId): Promise<DataViewByToken | null> {
        const foundUser = await collectionUsers.findOne(id)
        if (!foundUser) return null
        return {
            email: foundUser.email,
            login: foundUser.login,
            userId: foundUser._id.toString()
        }
    },

    async getEmailConfirmation(emailOrCode: string): Promise<EmailConfirmationType | null> {
        return collectionEmail.findOne({$or: [{email: emailOrCode}, {confirmationCode: emailOrCode}]}) as Promise<EmailConfirmationType | null>
    },

    async getRecoveryData(recoveryCode: string){
        return collectionEmail.findOne({recoveryCode})
    },

    async findDeviceSession(deviceId: string, date?: Date) {
        if(date){
        return await collectionDevicesAuthSessions.findOne({$and: [{lastActiveDate: new Date(date)}, {deviceId: deviceId}]})
        } else{
            return await collectionDevicesAuthSessions.findOne({deviceId: deviceId})
        }
    },

    async getAllSessions(userId: ObjectId) {
        const allSessionsUser = await collectionDevicesAuthSessions.find({userId: userId})
        return allSessionsUser.map(session => ({
            ip: session.ip,
            title: session.title,
            lastActiveDate: session.lastActiveDate,
            deviceId: session.deviceId
        })).toArray()
    },


    _mapUser(user: UserType) {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },
    _sortedLoginEmail(searchLoginTerm: string | null | undefined, searchEmailTerm: string | null | undefined) {
        return searchLoginTerm && searchEmailTerm ?
            {
                $or: [
                    {login: {$regex: searchLoginTerm, $options: 'i'}},
                    {email: {$regex: searchEmailTerm, $options: 'i'}}
                ]
            }
            : searchLoginTerm ? {login: {$regex: searchLoginTerm, $options: 'i'}}
                : searchEmailTerm ? {email: {$regex: searchEmailTerm, $options: 'i'}}
                    : {}
    }


}