export const settings = {
    MONGO_URI: process.env.MONGO_URI|| 'mongodb+srv://kirillnovokrest:kirill4022768@cluster0.ngpfdsn.mongodb.net/projectBlogsAndPosts?retryWrites=true&w=majority',
    SECRET_JWT: process.env.SECRET_JWT||'123',
    SECRET_REFRESH: process.env.SECRET_REFRESH||'234'
}