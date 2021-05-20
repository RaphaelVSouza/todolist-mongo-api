"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = require("./base/baseController");
const sendVerifyMail_1 = __importDefault(require("./userMail/sendVerifyMail"));
const checkEmail_1 = __importDefault(require("./userMail/checkEmail"));
class UserMailController extends baseController_1.baseController {
    sendVerificationMail(req, res) {
        return sendVerifyMail_1.default(req, res);
    }
    verifyEmail(req, res) {
        return checkEmail_1.default(req, res);
    }
}
exports.default = new UserMailController();
