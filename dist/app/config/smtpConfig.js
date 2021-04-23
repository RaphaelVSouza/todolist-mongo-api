"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: +process.env.MAIL_PORT || 0,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
};
