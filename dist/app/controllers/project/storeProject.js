"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../../models/Users");
const Projects_1 = require("../../models/Projects");
const Tasks_1 = require("../../models/Tasks");
async function storeProject(req, res) {
    const { userId } = req.user;
    let { title, description, tasks } = req.body;
    if (!title)
        title = 'No title';
    const project = await Projects_1.Project.create({ title, description, user_id: userId });
    if (!project)
        throw Error('Error on create a new project');
    if (tasks) {
        await Promise.all(tasks.map(async (task) => {
            if (task.hasOwnProperty('title')) {
                if (!task.title)
                    task.title = 'No title';
                const projectTask = new Tasks_1.Task({ title: task.title, project_id: project._id, user_id: userId });
                await projectTask.save();
                if (!project.tasks)
                    throw Error('Cannot find project tasks');
                project.tasks.push(projectTask._id);
            }
        }));
        await project.save();
    }
    const user = await Users_1.User.findById(userId);
    if (!user)
        return res.status(404).json({ error: 'User not found.' });
    user.projects.push(project.id);
    await user.save();
    return res.json({ project });
}
exports.default = storeProject;
