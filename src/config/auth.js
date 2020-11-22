import'dotenv/config.js';

export default {
    secret: process.env.TOKEN_SECRET,
    expiresIn: process.env.TOKEN_EXPIRES,
}