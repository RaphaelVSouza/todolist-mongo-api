"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Projects_1 = require("../../models/Projects");
const Tasks_1 = require("../../models/Tasks");
async function updateProject(req, res) {
    const { userId } = req.user;
    const { projectId } = req.params;
    let { title, description, tasks } = req.body;
    if (!title)
        title = 'No title';
    if (!description)
        description = null;
    const project = await Projects_1.Project.findOneAndUpdate({ $and: [{ user_id: userId }, { _id: projectId }] }, {
        title,
        description,
    }, { new: true, useFindAndModify: false });
    if (!project)
        return res.status(404).json({ error: 'Project not found.' });
    if (tasks) {
        project.tasks = [];
        await Tasks_1.Task.deleteMany({ project_id: project._id });
        await Promise.all(tasks.map(async (task) => {
            const projectTask = new Tasks_1.Task(Object.assign(Object.assign({}, task), { project_id: project._id, user_id: userId }));
            await projectTask.save();
            if (!project.tasks)
                throw Error('Cannot find project tasks');
            project.tasks.push(projectTask._id);
        }));
        await project.save();
    }
    return res.json({ project });
}
exports.default = updateProject;
