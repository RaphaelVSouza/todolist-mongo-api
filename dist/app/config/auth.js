"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    secret: process.env.TOKEN_SECRET,
    expiresIn: process.env.TOKEN_EXPIRES
};
