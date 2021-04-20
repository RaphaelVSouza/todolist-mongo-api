"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let retries = 2;
if (process.env.NODE_ENV !== "production")
    retries = 9999;
exports.default = retries;
