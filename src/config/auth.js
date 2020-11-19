require('dotenv').config()
module.exports = {
    secret: process.env.TOKEN_SECRET,
    expires: process.env.TOKEN_EXPIRES,
}