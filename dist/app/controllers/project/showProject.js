"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Projects_1 = require("../../models/Projects");
async function showProject(req, res) {
    const { userId } = req.user;
    const { projectId } = req.params;
    if (!projectId)
        return res.status(400).json({ error: 'Project ID must be passed.' });
    const project = await Projects_1.Project.find({
        $and: [{ user_id: userId }, { _id: projectId }]
    }).populate('tasks');
    if (!project)
        return res.status(404).json({ error: 'Project not found' });
    return res.json({ project });
}
exports.default = showProject;
