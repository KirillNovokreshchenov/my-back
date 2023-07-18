import {ObjectId} from "mongodb";
import {UserViewModel} from "../../../models/user-models/UserViewModel";
import {DeviceAuthSessionType, UserType} from "../../../db/db-users-type";
import {UsersQueryInputModel} from "../../../models/user-models/UsersQueryInputModel";
import {pageCount} from "../../../helpers/pageCount";
import {limitPages} from "../../../helpers/limitPages";
import {QueryViewModel} from "../../../models/QueryViewModel";
import {DataViewByToken} from "../../../models/auth-models/DataViewByToken";
import {UserMethods, UserModelClass} from "../../../domain/schema-user";
import {DeviceSessionModelClass} from "../../../domain/shema-session";
import {injectable} from "inversify";
import {HydratedDocument} from "mongoose";

@injectable()
 export class UsersQueryRepository {

    async allUsers(userQuery: UsersQueryInputModel): Promise<QueryViewModel<UserViewModel>> {
        const {
            searchLoginTerm = null,
            searchEmailTerm = null,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10
        } = userQuery



        const totalCount = await UserModelClass.countDocuments(this._sortedLoginEmail(searchLoginTerm, searchEmailTerm)).exec()
        const users = {
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


        return users
    }

    async findUser(id: ObjectId): Promise<UserViewModel|null> {
        const foundUser: UserType|null= await UserModelClass.findOne(id).lean().exec()

        if(!foundUser) return null
        return this._mapUser(foundUser)
    }

    async findUserWithToken(id: ObjectId): Promise<DataViewByToken | null> {
        const foundUser = await UserModelClass.findOne(id).lean().exec()

        if (!foundUser) return null
        return {
            email: foundUser.email,
            login: foundUser.login,
            userId: foundUser._id.toString()
        }
    }



    async getAllSessions(userId: ObjectId) {
        const allSessionsUser: DeviceAuthSessionType[] = await DeviceSessionModelClass.find({userId: userId}).lean()
        return allSessionsUser.map(session => ({
            ip: session.ip,
            title: session.title,
            lastActiveDate: session.lastActiveDate,
            deviceId: session.deviceId
        }))
    }


    _mapUser(user: UserType) {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
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

