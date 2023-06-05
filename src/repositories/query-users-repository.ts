import {ObjectId, Sort} from "mongodb";
import {UserViewModel} from "../models/user-models/UserViewModel";
import {collectionEmailConfirmations, collectionUsers} from "../db/db";
import {EmailConfirmationType, UserType} from "../db/db-users-type";
import {UsersQueryInputModel} from "../models/user-models/UsersQueryInputModel";
import {pageCount} from "../helpers/pageCount";
import {limitPages} from "../helpers/limitPages";
import {QueryViewModel} from "../models/QueryViewModel";
import {DataViewByToken} from "../models/auth-models/DataViewByToken";

export const usersQueryRepository = {

    allUsers: async function (userQuery: UsersQueryInputModel): Promise<QueryViewModel<UserViewModel>> {
        const {searchLoginTerm =null, searchEmailTerm = null, sortBy = 'createdAt', sortDirection='desc', pageNumber = 1, pageSize = 10} = userQuery

        const totalCount = await collectionUsers.countDocuments(this._sortedLoginEmail(searchLoginTerm, searchEmailTerm))

        return {
            pagesCount: pageCount(totalCount, +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: await collectionUsers
                .find(this._sortedLoginEmail(searchLoginTerm, searchEmailTerm))
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1}as Sort)
                .skip(limitPages(+pageNumber, +pageSize))
                .limit(+pageSize)
                .map(user => this._mapUser(user))
                .toArray()
        }
    },

    async findUser(id: ObjectId): Promise<UserViewModel> {
        const foundUser = await collectionUsers.findOne(id)
        return this._mapUser(foundUser!)

    },
    async findUserWithToken(id:ObjectId): Promise<DataViewByToken|null>{
        const foundUser = await collectionUsers.findOne(id)
        if(!foundUser) return null
        return  {
            email: foundUser.email,
            login: foundUser.login,
            userId: foundUser._id.toString()
        }


    },

    async getEmailConfirmation(email: string): Promise<EmailConfirmationType|null>{
        return await collectionEmailConfirmations.findOne({email: email})
    },

    _mapUser(user: UserType) {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },
    _sortedLoginEmail(searchLoginTerm: string|null|undefined, searchEmailTerm: string|null|undefined){
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