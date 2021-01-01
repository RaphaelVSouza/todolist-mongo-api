import Task from '../schemas/Tasks.js';

class TaskController {
  async update(req, res) {
    const { userId } = req.user;

    if (!userId) return res.status(401).send({ error: 'You must be logged in to see your projects' });

    const { taskId } = req.body;

    if (!taskId) return res.status(400).send({ error: 'TaskId must be suplied' });

    const task = await Task.findById(taskId);

    task.completed ? (task.completed = false) : (task.completed = true);

    task.save();

    return res.json(task);
  }
}

export default new TaskController();
