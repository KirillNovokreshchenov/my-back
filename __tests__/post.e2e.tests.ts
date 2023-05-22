import request from 'supertest'
import {app} from "../src/app";
import {errorsMessages} from "../src/models/ErrorModel";
import {CreateAndUpdateBlogInputModel} from "../src/models/blog-models/CreateAndUpdateBlogInputModel";
import {BlogViewModel} from "../src/models/blog-models/BlogViewModel";
import {CreateAndUpdatePostModel} from "../src/models/post-models/CreateAndUpdatePostModel";
import {PostViewModel} from "../src/models/post-models/PostViewModel";



describe('/post', ()=>{

    beforeAll(async ()=>{
        await request(app).delete('/testing/all-data')
    })


    it('should return 200 status and empty array',async()=>{
        await request(app)
            .get('/posts')
            .expect(200,   {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it('should return 404 status for not existing post',async()=>{
        await request(app)
            .get('/posts/-1')
            .expect(404)
    })

    it('should return 401 status for an unauthorised user when creating a post',async()=>{
        await request(app)
            .post('/posts')
            .auth('admin','qwertyy')
            .expect(401)
    })
    let createdBlogForPosts: BlogViewModel;

    it('should create blog with correct input data for posts', async ()=>{
        const data: CreateAndUpdateBlogInputModel = {
            name: 'babylon',
            description: 'Ancient Babylon blog',
            websiteUrl: 'https://babylon.com',
            createdAt: "2023-05-14T13:42:32.442Z"
        }
        const createResponse =  await request(app)
            .post('/blogs')
            .auth('admin','qwerty')
            .send(data)
            .expect(201)

        createdBlogForPosts = createResponse.body

        expect(createdBlogForPosts).toEqual({
            id: expect.stringMatching(/[0-9]+/),
            name: 'babylon',
            description: 'Ancient Babylon blog',
            websiteUrl: 'https://babylon.com',
            createdAt: "2023-05-14T13:42:32.442Z",
            isMembership: false
        })


        await request(app)
            .get('/blogs')
            .expect(200,   {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdBlogForPosts]
            })
    })



    it('should not return new created post with incorrect input data', async()=>{
        const bodyError: errorsMessages = {
            "errorsMessages": [
                {
                    "message": "incorrect title, max length 30 symbols, min 1 symbol",
                    "field": "title"
                },
                {
                    "message": "incorrect content, max length 1000 symbols, min 1 symbol",
                    "field": "content"
                },

            ]
        };
        const data: CreateAndUpdatePostModel =
            {"title": '',
            "shortDescription": 'string',
            "content": '',
            "blogId": createdBlogForPosts.id
            };
        await request(app)
            .post('/posts')
            .auth('admin','qwerty')
            .send(data)
            .expect(400, bodyError)
    })

    it('should not return new created post with incorrect BlogId', async()=>{
        const bodyError: errorsMessages = {
            "errorsMessages": [
                {
                    "message": "incorrect blogId",
                    "field": "blogId"
                }

            ]
        };
        const data: CreateAndUpdatePostModel =
            {
                "title": 'string',
                "shortDescription": 'string',
                "content": 'string',
                "blogId": '507f1f77bcf86cd799439011'
            };
        await request(app)
            .post('/posts')
            .auth('admin','qwerty')
            .send(data)
            .expect(400, bodyError)
    })

    it('should return 200 status and empty array',async()=>{
        await request(app)
            .get('/posts')
            .expect(200, [])
    })

    let createdPostOne: PostViewModel;
    let createdPostTwo: PostViewModel;

    it('should create post with correct input data', async ()=>{
        const dataOne: CreateAndUpdatePostModel =
            {
                title: 'Post1',
                shortDescription: 'shortDescriptionPost1',
                content: 'contentPost1',
                blogId: createdBlogForPosts.id,
                createdAt: "2023-05-14T13:45:24.653Z"
            }
        const createResponse =  await request(app)
            .post('/posts')
            .auth('admin','qwerty')
            .send(dataOne)
            .expect(201)

        createdPostOne = createResponse.body

        expect(createdPostOne).toEqual({
            id: expect.stringMatching(/[0-9]+/),
            title: 'Post1',
            shortDescription: 'shortDescriptionPost1',
            content: 'contentPost1',
            blogId: createdBlogForPosts.id,
            blogName: createdBlogForPosts.name,
            createdAt: "2023-05-14T13:45:24.653Z",

        })

        const dataTwo: CreateAndUpdatePostModel =
            {title: 'Post2',
            shortDescription: 'shortDescriptionPost2',
            content: 'contentPost2',
            blogId: createdBlogForPosts.id
            }
        const createResponseTwo =  await request(app)
            .post('/posts')
            .auth('admin','qwerty')
            .send(dataTwo)
            .expect(201)

        createdPostTwo = createResponseTwo.body

        expect(createdPostTwo).toEqual({
            id: expect.stringMatching(/[0-9]+/),
            title: 'Post2',
            shortDescription: 'shortDescriptionPost2',
            content: 'contentPost2',
            blogId: createdBlogForPosts.id,
            blogName: createdBlogForPosts.name,
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
        })

        await request(app)
            .get('/posts')
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items:[createdPostTwo, createdPostOne]
            })
    })

    it('should return existing post', async ()=>{
        await request(app)
            .get('/posts/'+ createdPostOne.id)
            .expect(200, createdPostOne)

        await request(app)
            .get('/posts/'+ createdPostTwo.id)
            .expect(200, createdPostTwo)


    })

    it('should return 401 status for an unauthorised user when update the post',async()=>{
        await request(app)
            .put('/posts/'+ createdPostOne.id)
            .auth('admin','qwertyy')
            .expect(401)
    })

    it('should not update post that does not exist',async()=>{
        const data1: CreateAndUpdatePostModel = {
            title: 'Post1',
            shortDescription: 'shortDescriptionPost1',
            content: 'contentPost1',
            blogId: createdBlogForPosts.id,
            createdAt: "2023-05-14T13:45:24.653Z"
        }
        await request(app)
            .put('/posts/-1')
            .auth('admin','qwerty')
            .send(data1)
            .expect(404)
    })

    it('should not update post with incorrect input data',async()=>{
        const data: CreateAndUpdatePostModel = {
            "title": '',
            "shortDescription": 'shortDescription',
            "content": '',
            "blogId": createdBlogForPosts.id
        };
        const bodyError: errorsMessages = {
            "errorsMessages": [
                {
                    "message": "incorrect title, max length 30 symbols, min 1 symbol",
                    "field": "title"
                },
                {
                    "message": "incorrect content, max length 1000 symbols, min 1 symbol",
                    "field": "content"
                },
            ]
        };
        await request(app)
            .put('/posts/'+createdPostOne.id)
            .auth('admin','qwerty')
            .send(data)
            .expect(400, bodyError)

        await request(app)
            .get('/posts/'+createdPostOne.id)
            .expect(200, createdPostOne)
    })

    it('should not update post with incorrect input BlogId',async()=>{
        const data: CreateAndUpdatePostModel = {
            "title": 'title',
            "shortDescription": 'shortDescription',
            "content": 'content',
            "blogId": '507f1f77bcf86cd799439011'
        };
        const bodyError: errorsMessages = {
            "errorsMessages": [
                {
                    "message": "incorrect blogId",
                    "field": "blogId"
                }
            ]
        };
        await request(app)
            .put('/posts/'+createdPostOne.id)
            .auth('admin','qwerty')
            .send(data)
            .expect(400, bodyError)

        await request(app)
            .get('/posts/'+createdPostOne.id)
            .expect(200, createdPostOne)
    })




    it('should update post with correct input data',async()=>{
        const data: CreateAndUpdatePostModel = {
            "title": 'title',
            "shortDescription": 'shortDescription',
            "content": 'content',
            "blogId": createdBlogForPosts.id
        };
        await request(app)
            .put('/posts/'+createdPostOne.id)
            .auth('admin','qwerty')
            .send(data)
            .expect(204)

        const updateBlog: PostViewModel = {
            ...createdPostOne,
            "title": 'title',
            "shortDescription": 'shortDescription',
            "content": 'content'
        };
        await request(app)
            .get('/posts/'+createdPostOne.id)
            .expect(200, updateBlog)

        await request(app)
            .get('/posts/'+createdPostTwo.id)
            .expect(200, createdPostTwo)
    })
    it('should return 401 status for an unauthorised user when deleting a post', async()=>{
        await request(app)
            .delete('/posts/'+createdPostOne.id)
            .auth('admin','qwertyy')
            .expect(401)
    })
    it('should not deleted post that does not exist',async()=>{
        await request(app)
            .delete('/posts/507f1f77bcf86cd799439011')
            .auth('admin','qwerty')
            .expect(404)
    })
    it('should delete both posts',async()=>{
        await request(app)
            .delete('/posts/'+createdPostOne.id)
            .auth('admin','qwerty')
            .expect(204)
        await request(app)
            .get('/posts/'+createdPostOne.id)
            .expect(404)

        await request(app)
            .delete('/posts/'+createdPostTwo.id)
            .auth('admin','qwerty')
            .expect(204)

        await request(app)
            .get('/posts')
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

})