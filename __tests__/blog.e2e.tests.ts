import request from 'supertest'
import {app} from "../src/app";
import {errorsMessages} from "../src/models/ErrorModel";
import {CreateAndUpdateBlogInputModel} from "../src/models/blog-models/CreateAndUpdateBlogInputModel";
import {BlogViewModel} from "../src/models/blog-models/BlogViewModel";
import {pageCount} from "../src/helpers/pageCount";
import {PostViewModel} from "../src/models/post-models/PostViewModel";
import {CreateAndUpdatePostModel} from "../src/models/post-models/CreateAndUpdatePostModel";


describe('/blog', ()=>{

    beforeAll(async ()=>{
        await request(app).delete('/testing/all-data')
    })


    it('should return 200 status and empty array',async()=>{
        await request(app)
            .get('/blogs')
            .expect(200,
                {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
                })
    })

    it('should return 404 status for not existing blog',async()=>{
        await request(app)
            .get('/blogs/-1')
            .expect(404)
    })

    it('should return 401 status for an unauthorised user when creating a blog',async()=>{
        await request(app)
            .post('/blogs')
            .auth('admin','qwertyy')
            .expect(401)
    })
    it('should not return new created blog with incorrect input data', async()=>{
        const bodyError: errorsMessages = {
            "errorsMessages": [
                {
                    "message": "incorrect name, max length 15 symbols",
                    "field": "name"
                },
                {
                    "message": "incorrect description, max length 500 symbols",
                    "field": "description"
                },
                {
                    "message": "incorrect website URL",
                    "field": "websiteUrl"
                }
            ]
        };
        const data: CreateAndUpdateBlogInputModel =
            {
            name: '',
            description:'',
            websiteUrl: 'https:/babylon.com'
            };
        await request(app)
            .post('/blogs')
            .auth('admin','qwerty')
            .send(data)
            .expect(400, bodyError)
    })

    it('should return 200 status and empty array',async()=>{
        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    let createdBlogOne: BlogViewModel;
    let createdBlogTwo: BlogViewModel;

    it('should create blog with correct input data', async ()=>{
        const dataOne: CreateAndUpdateBlogInputModel = {
            name: 'babylon',
            description: 'Ancient Babylon blog',
            websiteUrl: 'https://babylon.com',
            createdAt: "2023-05-14T13:35:59.278Z"
        }
        const createResponse =  await request(app)
            .post('/blogs')
            .auth('admin','qwerty')
            .send(dataOne)
            .expect(201)

        createdBlogOne = createResponse.body

        expect(createdBlogOne).toEqual({
            id: expect.stringMatching(/[0-9]+/),
            name: 'babylon',
            description: 'Ancient Babylon blog',
            websiteUrl: 'https://babylon.com',
            createdAt: "2023-05-14T13:35:59.278Z",
            isMembership: false
        })

        const dataTwo: CreateAndUpdateBlogInputModel = {
            name: 'rome',
            description:'Ancient Rome blog',
            websiteUrl: 'https://rome.com',
            createdAt: "2023-05-14T13:35:55.278Z"
        }
        const createResponseTwo =  await request(app)
            .post('/blogs')
            .auth('admin','qwerty')
            .send(dataTwo)
            .expect(201)

        createdBlogTwo = createResponseTwo.body

        expect(createdBlogTwo).toEqual({
            id: expect.stringMatching(/[0-9]+/),
            name: 'rome',
            description:'Ancient Rome blog',
            websiteUrl: 'https://rome.com',
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
            isMembership: false
        })

        await request(app)
            .get('/blogs')
            .expect(200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [createdBlogOne, createdBlogTwo]
                }
                )
    })

    it('should return existing video', async ()=>{
        await request(app)
            .get('/blogs/'+ createdBlogOne.id)
            .expect(200, createdBlogOne)

        await request(app)
            .get('/blogs/'+ createdBlogTwo.id)
            .expect(200, createdBlogTwo)


    })


    let createdPost: PostViewModel

    it('should return created post for blog', async()=>{
        const dataPost: CreateAndUpdatePostModel = {
            title: 'Post One',
            shortDescription:'My Post',
            content: 'This is best Post',
            blogId: createdBlogOne.id
        }
       const responsePost =  await request(app)
            .post('/blogs/'+createdBlogOne.id+'/posts')
            .auth('admin','qwerty')
            .send(dataPost)
            .expect(201)

        createdPost = responsePost.body

        expect(createdPost).toEqual({
            id: expect.stringMatching(/[0-9]+/),
            title: 'Post One',
            shortDescription: 'My Post',
            content: 'This is best Post',
            blogId: createdBlogOne.id,
            blogName: createdBlogOne.name,
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
        })

        await request(app)
            .get('/blogs/'+createdBlogOne.id+'/posts')
            .expect(200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [createdPost]
                }
            )
    })





    it('should return 401 status for an unauthorised user when update the blog',async()=>{
        await request(app)
            .put('/blogs/'+ createdBlogOne.id)
            .auth('admin','qwertyy')
            .expect(401)
    })

    it('should not update blog that does not exist',async()=>{
        const data: CreateAndUpdateBlogInputModel = {
            name: 'babylon',
            description: 'Ancient Babylon blog',
            websiteUrl: 'https://babylon.com'
        };
        await request(app)
            .put('/blogs/-1')
            .auth('admin','qwerty')
            .send(data)
            .expect(404)
    })

    it('should not update blog with incorrect input data',async()=>{
        const data: CreateAndUpdateBlogInputModel = {
            name: '',
            description: 'Ancient Babylon blog',
            websiteUrl: 'https:/babylon.com'
        };
        const bodyError: errorsMessages = {
            "errorsMessages": [
                {
                    "message": "incorrect name, max length 15 symbols",
                    "field": "name"
                },
                {
                    "message": "incorrect website URL",
                    "field": "websiteUrl"
                }
            ]
        };
        await request(app)
            .put('/blogs/'+createdBlogOne.id)
            .auth('admin','qwerty')
            .send(data)
            .expect(400, bodyError)

        await request(app)
            .get('/blogs/'+createdBlogOne.id)
            .expect(200, createdBlogOne)
    })

    it('should update blog with correct input data',async()=>{
        const data: CreateAndUpdateBlogInputModel = {
            name: 'rome',
            description:'Ancient Rome blog',
            websiteUrl: 'https://rome.com'};
        await request(app)
            .put('/blogs/'+createdBlogOne.id)
            .auth('admin','qwerty')
            .send(data)
            .expect(204)

        const updateBlog: BlogViewModel = {
            ...createdBlogOne,
            name: 'rome',
            description:'Ancient Rome blog',
            websiteUrl: 'https://rome.com'
        };
        await request(app)
            .get('/blogs/'+createdBlogOne.id)
            .expect(200, updateBlog)

        await request(app)
            .get('/blogs/'+createdBlogTwo.id)
            .expect(200, createdBlogTwo)
    })
    it('should return 401 status for an unauthorised user when deleting a blog', async()=>{
        await request(app)
            .delete('/blogs/'+createdBlogOne.id)
            .auth('admin','qwertyy')
            .expect(401)
    })
    it('should not deleted blog that does not exist',async()=>{
        const data = {
            "name": "Malvin",
            "description": "string",
            "websiteUrl": "https://www.deepl.com/"
        }
        await request(app)
            .put('/blogs/-1')
            .send(data)
            .auth('admin','qwerty')
            .expect(404)
    })
    it('should delete both blogs',async()=>{
        await request(app)
            .delete('/blogs/'+createdBlogOne.id)
            .auth('admin','qwerty')
            .expect(204)
        await request(app)
            .get('/blogs/'+createdBlogOne.id)
            .expect(404)

        await request(app)
            .delete('/blogs/'+createdBlogTwo.id)
            .auth('admin','qwerty')
            .expect(204)

        await request(app)
            .get('/blogs')
            .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []} )
    })

})