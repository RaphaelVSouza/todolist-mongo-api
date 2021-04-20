"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Projects_1 = require("../../models/Projects");
async function removeProject(req, res) {
    const { projectId } = req.params;
    const { userId } = req.user;
    if (!projectId)
        return res.status(400).json({ error: 'Project ID must be passed.' });
    const project = await Projects_1.Project.findOne({ $and: [{ user_id: userId }, { _id: projectId }] });
    if (!project)
        return res.status(404).json({ error: 'Project not found.' });
    await project.remove();
    return res.send({ message: 'Project removed' });
}
exports.default = removeProject;
