"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tasks_1 = require("../../models/Tasks");
async function removeProject(req, res) {
    const { userId } = req.user;
    const { taskId } = req.params;
    if (!taskId)
        return res.status(400).json({ error: 'Task ID must be passed.' });
    const task = await Tasks_1.Task.findOne({
        $and: [{ user_id: userId }, { _id: taskId }]
    });
    if (!task)
        return res.status(404).json({ error: 'Task not found.' });
    task.completed ? (task.completed = false) : (task.completed = true);
    task.save();
    return res.json(task);
}
exports.default = removeProject;
