import request from 'supertest'
import {app} from "../src";


describe('/video', ()=>{

    beforeAll(async ()=>{
        await request(app).delete('/testing/all-data')
    })


    it('should return 200 status and empty array',async()=>{
        await request(app)
            .get('/videos')
            .expect(200, [])
    })

    it('should return 404 status for not existing video',async()=>{
        await request(app)
            .get('/videos/-1')
            .expect(404)
    })

    it('should not return new created video with incorrect author and title',async()=>{
        await request(app)
            .post('/videos')
            .send({title: '', author:''})
            .expect(400, {
                "errorsMessages": [
                    {
                        "message": "incorrect title",
                        "field": "title"
                    },
                    {
                        "message": "incorrect author",
                        "field": "author"
                    }
                ]
            })
    })

    it('should not return new created video with incorrect author',async()=>{
        await request(app)
            .post('/videos')
            .send({title: 'My video', author:''})
            .expect(400, {
                "errorsMessages": [
                    {
                        "message": "incorrect author",
                        "field": "author"
                    }
                ]
            })
    })

    it('should not return new created video with incorrect canBeDownloaded',async()=>{
        await request(app)
            .post('/videos')
            .send({title: 'My video', author:'Kirill', canBeDownloaded: 'true'})
            .expect(400, {
                "errorsMessages": [
                    {
                        "message": "incorrect data type",
                        "field": "canBeDownloaded"
                    }
                ]
            })
    })

    it('should return 200 status and empty array',async()=>{
        await request(app)
            .get('/videos')
            .expect(200, [])
    })















})