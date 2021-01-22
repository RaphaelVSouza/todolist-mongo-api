import Task from '../schemas/Tasks';
import Project from '../schemas/Projects';

class TaskController {
  async update(req, res) {
    const { userId } = req.user;
    const { taskId } = req.params;

    if (!userId) return res.boom.unauthorized('Need to login');

    if (!taskId) return res.boom.badRequest('TaskId must be passed.');

    const task = await Task.findById(taskId);

    if (!task) return res.boom.notFound('Task not found.');

    task.completed ? (task.completed = false) : (task.completed = true);

    task.save();

    return res.json(task);
  }

  async delete(req, res) {
    const { userId } = req.user;

    if (!userId) return res.boom.unauthorized('Need to login');

    const { taskId } = req.params;

    if (!taskId) return res.boom.badRequest('TaskId must be passed.');

    const task = await Task.findById(taskId);

    if (!task) return res.boom.notFound('Task not found.');

    await task.remove();

    return res.json({ message: 'Task Successfully removed' });
  }
}

export default new TaskController();
