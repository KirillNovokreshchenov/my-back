import request from 'supertest'
import {VideoCreateAndUpdateModel} from "../src/models/video-model/VideoCreateModel";
import {VideoViewModel} from "../src/models/video-model/VideoViewModel";
import {errorsMessages} from "../src/helpers/videoHelpers/validation";
import {app} from "../src/app";


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

    it('should not return new created video with incorrect inputs author and title',async()=>{
        const data: VideoCreateAndUpdateModel = {title: '', author: ''};
        const bodyError: errorsMessages = {
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
        };
        await request(app)
            .post('/videos')
            .send(data)
            .expect(400, bodyError)
    })

    it('should not return new created video with incorrect input author',async()=>{

        const data: VideoCreateAndUpdateModel = {title: 'My video', author:''};
        const bodyError: errorsMessages = {
            "errorsMessages": [
                {
                    "message": "incorrect author",
                    "field": "author"
                }
            ]
        };
        await request(app)
            .post('/videos')
            .send(data)
            .expect(400, bodyError)
    })

    it('should not return new created video with incorrect input canBeDownloaded',async()=>{
        const data:VideoCreateAndUpdateModel = {title: 'My video', author:'Kirill', minAgeRestriction: 20};
        const bodyError: errorsMessages = {
            "errorsMessages": [
                {
                    "message": "incorrect age",
                    "field": "minAgeRestriction"
                }
            ]
        };
        await request(app)
            .post('/videos')
            .send(data)
            .expect(400, bodyError)
    })

    it('should return 200 status and empty array',async()=>{
        await request(app)
            .get('/videos')
            .expect(200, [])
    })

    let createdVideo: VideoViewModel;
    let createdVideoTwo: VideoViewModel;

    it('should create video with correct inputs author and title', async ()=>{
        const data: VideoCreateAndUpdateModel = {title: 'My video', author: 'Kirill'};
        const createResponse =  await request(app)
            .post('/videos')
            .send(data)
            .expect(201)

        createdVideo = createResponse.body

        expect(createdVideo).toEqual({
            "id": expect.any(Number),
            "title": "My video",
            "author": "Kirill",
            "canBeDownloaded": false,
            "minAgeRestriction": null,
            "createdAt": expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
            "publicationDate": expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
            "availableResolutions": []
        })

        const data2:VideoCreateAndUpdateModel  = {title: 'My video two', author: 'KirillSecond'};
        const createResponseTwo =  await request(app)
            .post('/videos')
            .send(data2)
            .expect(201)

        createdVideoTwo = createResponseTwo.body

        expect(createdVideoTwo).toEqual({
            "id": expect.any(Number),
            "title": "My video two",
            "author": "KirillSecond",
            "canBeDownloaded": false,
            "minAgeRestriction": null,
            "createdAt": expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
            "publicationDate": expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
            "availableResolutions": []
        })


        await request(app)
            .get('/videos')
            .expect(200, [createdVideo, createdVideoTwo])
    })

    it('should return existing video', async ()=>{
        await request(app)
            .get('/videos/'+ createdVideo.id)
            .expect(200, createdVideo)

        await request(app)
            .get('/videos/'+ createdVideoTwo.id)
            .expect(200, createdVideoTwo)


    })

    it('should not update video with incorrect input author and title',async()=>{
        const data: VideoCreateAndUpdateModel = {title: '', author:'NebuchadnezzarNebuchadnezzarNebuchadnezzarNebuchadnezzar'};
        const bodyError: errorsMessages = {
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
        };
        await request(app)
            .put('/videos/'+createdVideo.id)
            .send(data)
            .expect(400, bodyError)

        await request(app)
            .get('/videos/'+createdVideo.id)
            .expect(200, createdVideo)
    })

    it('should not update video that does not exist',async()=>{
        const data: VideoCreateAndUpdateModel = {title: 'Hir video', author:'Nebuchadnezzar'};
        await request(app)
            .put('/videos/-1')
            .send(data)
            .expect(404)
    })

    it('should update video with correct input author and title',async()=>{
        const data: VideoCreateAndUpdateModel = {title: 'Hir video', author:'Nebuchadnezzar'};
        await request(app)
            .put('/videos/'+createdVideo.id)
            .send(data)
            .expect(204)

        const updateVideo: VideoViewModel = {
            ...createdVideo,
            title: 'Hir video',
            author:'Nebuchadnezzar'
        };
        await request(app)
            .get('/videos/'+createdVideo.id)
            .expect(200, updateVideo)

        await request(app)
            .get('/videos/'+createdVideoTwo.id)
            .expect(200, createdVideoTwo)
    })

    it('should delete both video',async()=>{
        await request(app)
            .delete('/videos/'+createdVideo.id)
            .expect(204)
        await request(app)
            .get('/videos/'+createdVideo.id)
            .expect(404)

        await request(app)
            .delete('/videos/'+createdVideoTwo.id)
            .expect(204)

        await request(app)
            .get('/videos')
            .expect(200, [])
    })


})