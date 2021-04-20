"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Projects_1 = require("../../models/Projects");
async function listProjects(req, res) {
    const { userId } = req.user;
    const { title, skip = 0, limit = 10 } = req.query;
    const query = title
        ? { $and: [{ user_id: userId }, { title: { $regex: `.*${title}.*`, $options: "i" } }] }
        : { user_id: userId };
    const projects = await Projects_1.Project.find(query).skip(+skip).limit(+limit);
    return res.json({ projects });
}
exports.default = listProjects;
