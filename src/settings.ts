export const settings = {
    MONGO_URI: process.env.MONGO_URI,
    SECRET_JWT: process.env.SECRET_JWT ||'123',
    SECRET_REFRESH: process.env.SECRET_REFRESH ||'234'
}