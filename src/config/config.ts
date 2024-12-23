import dotenv from 'dotenv';

dotenv.config()

export default{
    JWTSecret: process.env.JWT_SECRET || 'secreto',
    DB: {
        URI:  process.env.MONGODB_URI || '', 
        USER: process.env.MONGODB_USER  || '', 
        PASSWORD: process.env.MONGODB_PASSWORD || ''
    }
}