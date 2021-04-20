"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const auth_1 = __importDefault(require("../../../config/auth"));
const Users_1 = require("../../../models/Users");
const applyJWTStrategy = (passport) => {
    let options = {};
    options.jwtFromRequest = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = auth_1.default.secret;
    passport.use(new passport_jwt_1.Strategy(options, (payload, done) => {
        Users_1.User.findById({ _id: payload.id }, (err, user) => {
            if (err)
                return done(err, false);
            if (user) {
                return done(null, {
                    userId: user._id,
                });
            }
            return done(null, false);
        });
    }));
};
exports.default = applyJWTStrategy;
