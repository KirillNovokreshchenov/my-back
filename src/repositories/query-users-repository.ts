import {ObjectId} from "mongodb";
import {UserViewModel} from "../models/user-models/UserViewModel";
import {collectionBlogs, collectionUsers} from "../db/db";
import {UserType} from "../db/db-users-type";
import {UsersQueryInputModel} from "../models/user-models/UsersQueryInputModel";
import {UsersQueryViewModel} from "../models/user-models/UsersQueryViewModel";
import {pageCount} from "../helpers/pageCount";
import {limitPages} from "../helpers/limitPages";

export const usersQueryRepository = {

    async allUsers({
                       searchLoginTerm = null,
                       searchEmailTerm = null,
                       sortBy = 'createdAt',
                       sortDirection = 'desc',
                       pageNumber = 1,
                       pageSize = 10
                   }: UsersQueryInputModel): Promise<UsersQueryViewModel> {

        const totalCount = await collectionUsers.countDocuments({
            $or: [
                {login: {$regex: `${searchLoginTerm ? searchLoginTerm : ''}`, $options: 'i'}},
                {email: {$regex: `${searchEmailTerm ? searchEmailTerm : ''}`, $options: 'i'}}
            ]
        })

        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: await collectionUsers
                .find({
                $or: [
                    {login: {$regex: `${searchLoginTerm ? searchLoginTerm : ''}`, $options: 'i'}},
                    {email: {$regex: `${searchEmailTerm ? searchEmailTerm : ''}`, $options: 'i'}}
                ]
            })
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                .skip(limitPages(+pageNumber, +pageSize))
                .limit(+pageSize)
                .map(user=>this._mapUser(user))
                .toArray()
        }
    },

    async findUser(id: ObjectId): Promise<UserViewModel> {
        const foundUser = await collectionUsers.findOne(id)
        return this._mapUser(foundUser!)

    },

    _mapUser(user: UserType) {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}