"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tasks_1 = require("../../models/Tasks");
async function removeTask(req, res) {
    const { userId } = req.user;
    const { taskId } = req.params;
    if (!taskId)
        return res.status(400).json({ error: 'Task ID must be passed.' });
    const task = await Tasks_1.Task.findOne({
        $and: [{ user_id: userId }, { _id: taskId }]
    });
    if (!task)
        return res.status(404).json({ error: 'Task not found.' });
    await task.remove();
    return res.json({ message: 'Task Successfully removed' });
}
exports.default = removeTask;
