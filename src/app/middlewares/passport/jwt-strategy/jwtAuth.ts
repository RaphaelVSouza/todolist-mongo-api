import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import { PassportStatic } from 'passport'
import authConfig from '../../../config/auth'
import { User } from '../../../models/Users'

const applyJWTStrategy = (passport: PassportStatic) => {
  const options = {} as StrategyOptions

  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

  options.secretOrKey = authConfig.secret
  passport.use(
    new Strategy(options, (payload, done) => {
      User.findById({ _id: payload.id }, (err, user) => {
        if (err) return done(err, false)
        if (user) {
          return done(null, {
            userId: user._id
          })
        }
        return done(null, false)
      })
    })
  )
}

export default applyJWTStrategy
