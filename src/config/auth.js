require('dotenv').config()
module.exports = {
    secret: process.env.TOKEN_SECRET,
    expiresIn: process.env.TOKEN_EXPIRES,
}