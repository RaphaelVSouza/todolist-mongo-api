import Task from '../schemas/Tasks';
import Project from '../schemas/Projects';

class TaskController {
  async update(req, res) {
    const { userId } = req.user;
    const { projectId, taskId } = req.params;

    if (!userId) return res.boom.unauthorized('Need to login');

    if (!projectId) return res.boom.badRequest('ProjectId must be passed.');

    const project = await Project.findById(projectId);

    if (!project) return res.boom.notFound('Project not found.');

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

    const { projectId, taskId } = req.params;

    if (!projectId) return res.boom.badRequest('ProjectId must be passed.');

    const project = await Project.findById(projectId);

    if (!project) return res.boom.notFound('Project not found.');

    if (!taskId) return res.boom.badRequest('TaskId must be passed.');

    const deleted = await Task.deleteOne({ _id: taskId });

    if (!deleted.ok !== 1) return res.boom.notFound('Task not found.');

    return res.json({ message: 'Task Successfully removed' });
  }
}

export default new TaskController();
