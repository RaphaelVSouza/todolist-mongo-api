"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = require("./base/baseController");
const updateTask_1 = __importDefault(require("./task/updateTask"));
const removeTask_1 = __importDefault(require("./task/removeTask"));
class TaskController extends baseController_1.baseController {
    async update(req, res) {
        return updateTask_1.default(req, res);
    }
    async delete(req, res) {
        return removeTask_1.default(req, res);
    }
}
exports.default = new TaskController();
