"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeAccessLog = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function writeAccessLog() {
    const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, '..', '..', 'logs', 'access.log'), { flags: 'a' });
    return accessLogStream;
}
exports.writeAccessLog = writeAccessLog;
