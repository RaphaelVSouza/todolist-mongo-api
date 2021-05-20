"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = require("./base/baseController");
const createSession_1 = __importDefault(require("./session/createSession"));
class SessionController extends baseController_1.baseController {
    store(req, res) {
        return createSession_1.default(req, res);
    }
}
exports.default = new SessionController();
