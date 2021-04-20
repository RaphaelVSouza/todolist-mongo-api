"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const remove_1 = require("./avatar/remove");
const baseController_1 = require("./base/baseController");
class AvatarController extends baseController_1.baseController {
    delete(req, res) {
        return remove_1.AvatarRemove(req, res);
    }
}
exports.default = new AvatarController();
