"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const queue_1 = __importDefault(require("./app/subscriber/queue"));
queue_1.default.processQueue();
console.log('Queue running');
