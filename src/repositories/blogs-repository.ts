import {BlogType} from "../db/db-blogs-type";
import {changeBlogNamePosts} from "../helpers/blog-helpers/changeBlogNamePosts";
import {collectionBlogs} from "../db/db";
import {CreateAndUpdateBlogModel} from "../models/blog-models/CreateAndUpdateBlogModel";


export const blogsRepository = {
    async allBlogs():Promise<BlogType[]>{
        return collectionBlogs.find({}, {projection: { _id: 0}}).toArray()
    },

    async createBlog({name, description, websiteUrl, createdAt}: CreateAndUpdateBlogModel): Promise<BlogType>{
        const createBlog: BlogType = {
            id: `${+new Date()}`,
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: createdAt || new Date().toISOString(),
            isMembership: false
        }
        await collectionBlogs.insertOne(createBlog)
        const foundNewCreatedBlog = await collectionBlogs.findOne({id: createBlog.id}, {projection: { _id: 0}})
        return foundNewCreatedBlog!

    },
    async findBlog(id: string): Promise<BlogType|null>{
        return collectionBlogs.findOne({id: id}, {projection: { _id: 0}})
    },

    async  updateBlog(id: string,{name, description, websiteUrl, createdAt}: CreateAndUpdateBlogModel): Promise<boolean>{
      const result =  createdAt ?
           await collectionBlogs.updateOne({id}, {$set: {name, description, websiteUrl, createdAt}})
           :await collectionBlogs.updateOne({id}, {$set: {name, description, websiteUrl}})


        await changeBlogNamePosts(id, name)

        return result.matchedCount === 1
    },

    async  deleteBlog(id: string) : Promise<boolean> {
        const result = await collectionBlogs.deleteOne({id: id})

        return result.deletedCount === 1
    }
}