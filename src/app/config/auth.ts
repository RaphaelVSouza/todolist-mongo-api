import 'dotenv/config'

export default {
  secret: process.env.TOKEN_SECRET,
  expiresIn: process.env.TOKEN_EXPIRES
}
