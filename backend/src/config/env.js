import dotenv from 'dotenv';

// we are going to handle env values 

export const env {
    Port: process.env.Port,
    NODE_ENV: process.env.NODE_ENV
}

export default env;