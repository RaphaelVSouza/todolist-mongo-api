"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = require("./base/baseController");
const storePasswordToken_1 = __importDefault(require("./password/storePasswordToken"));
const resetPassword_1 = __importDefault(require("./password/resetPassword"));
class PasswordController extends baseController_1.baseController {
    store(req, res) {
        return storePasswordToken_1.default(req, res);
    }
    update(req, res) {
        return resetPassword_1.default(req, res);
    }
}
exports.default = new PasswordController();
