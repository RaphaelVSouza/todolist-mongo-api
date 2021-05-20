"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = require("./base/baseController");
const storeProject_1 = __importDefault(require("./project/storeProject"));
const listProjects_1 = __importDefault(require("./project/listProjects"));
const showProject_1 = __importDefault(require("./project/showProject"));
const updateProject_1 = __importDefault(require("./project/updateProject"));
const removeProject_1 = __importDefault(require("./project/removeProject"));
class ProjectController extends baseController_1.baseController {
    store(req, res) {
        return storeProject_1.default(req, res);
    }
    index(req, res) {
        return listProjects_1.default(req, res);
    }
    show(req, res) {
        return showProject_1.default(req, res);
    }
    update(req, res) {
        return updateProject_1.default(req, res);
    }
    delete(req, res) {
        return removeProject_1.default(req, res);
    }
}
exports.default = new ProjectController();
