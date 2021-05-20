"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = require("./base/baseController");
const createUser_1 = __importDefault(require("./user/createUser"));
const updateUser_1 = __importDefault(require("./user/updateUser"));
const removeUser_1 = __importDefault(require("./user/removeUser"));
class UserController extends baseController_1.baseController {
    store(req, res) {
        return createUser_1.default(req, res);
    }
    update(req, res) {
        return updateUser_1.default(req, res);
    }
    delete(req, res) {
        return removeUser_1.default(req, res);
    }
}
exports.default = new UserController();
