import { Strategy, ExtractJwt } from 'passport-jwt';
import authConfig from '../../config/auth.js';
import User from '../schemas/Users.js';

const applyPassportStrategy = (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

  options.secretOrKey = authConfig.secret;
  passport.use(
    new Strategy(options, (payload, done) => {
      User.findById({ _id: payload.id }, (err, user) => {
        if (err) return done(err, false);
        if (user) {
          return done(null, {
            userId: user.id,
          });
        }
        return done(null, false);
      });
    }),
  );
};

export default applyPassportStrategy;
