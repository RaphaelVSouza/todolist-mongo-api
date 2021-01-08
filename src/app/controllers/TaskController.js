import Task from '../schemas/Tasks';
import Project from '../schemas/Projects';

class TaskController {
  async update(req, res) {
    const { userId } = req.user;

    if (!userId) return res.status(401).send({ error: 'You must be logged in to see your projects' });

    const { projectId, taskId } = req.params;

    if (!projectId) return res.status(400).send({ error: 'projectId must be suplied' });

    if (!taskId) return res.status(400).send({ error: 'TaskId must be suplied' });

    const task = await Task.findById(taskId);

    if (!task) return res.status(404).send({ error: 'Task not found' });

    task.completed ? (task.completed = false) : (task.completed = true);

    task.save();

    return res.json(task);
  }

  async delete(req, res) {
    const { userId } = req.user;

    if (!userId) return res.status(401).send({ error: 'You must be logged in to see your projects' });

    const { projectId, taskId } = req.params;

    if (!projectId) return res.status(400).send({ error: 'projectId must be suplied' });

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).send({ error: 'Project not found' });

    if (!taskId) return res.status(400).send({ error: 'TaskId must be suplied' });

    const task = await Task.findById(taskId);

    if (!task) return res.status(404).send({ error: 'Task not found' });

    task.completed ? (task.completed = false) : (task.completed = true);

    task.save();

    return res.json(task);
  }
}

export default new TaskController();
