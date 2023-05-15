import {BlogType} from "../db/db-blogs-type";
import {collectionBlogs, collectionPosts} from "../db/db";
import {CreateAndUpdateBlogModel} from "../models/blog-models/CreateAndUpdateBlogModel";
import {filterProperties} from "../helpers/blog-helpers/filterProperties";


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

    async  updateBlog(id: string,{name, description, websiteUrl, ...optionalProperties}: CreateAndUpdateBlogModel): Promise<boolean>{
      const optionalPropertiesIsValid = filterProperties(optionalProperties)
        const result =
           await collectionBlogs.updateOne({id}, {$set: {name, description, websiteUrl, ...optionalPropertiesIsValid}})

        await collectionPosts.updateMany({blogId: id}, {$set:{blogName: name}})


        return result.matchedCount === 1
    },

    async  deleteBlog(id: string) : Promise<boolean> {
        const result = await collectionBlogs.deleteOne({id: id})

        return result.deletedCount === 1
    }
}