import Project from '../schemas/Projects.js';
import Task from '../schemas/Tasks.js';

class ProjectController {
  async store(req, res) {
    const { userId } = req.user;

    if (!userId) return res.boom.unauthorized('Need to login first.');

    let { title, description, tasks } = req.body;

    if (!title) title = 'No title';

    if (!description) description = null;

    const project = await Project.create({ title, description, user: userId });

    /**
         * Handle and wait all tasks to be saved at project
         */

    if (tasks) {
      await Promise.all(
        tasks.map(async (task) => {
          if (task.hasOwnProperty('title')) {
            if (!task.title) task.title = 'No title';

            const projectTask = new Task({ title: task.title, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
          }
        }),
      );
      await project.save();
    }

    return res.json(project);
  }

  async index(req, res) {
    const { userId } = req.user;

    const { title, skip, limit } = req.query;

    const query = title ? { title: { $regex: `.*${title}*.` } } : null;

    if (!userId) return res.boom.unauthorized('Need to login first.');

    const projects = await Project.find({ user: userId, query })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select('-_id title')
      .populate('tasks')
      .populate({ path: 'user', select: 'name' });

    return res.json(projects);
  }

  async show(req, res) {
    const { userId } = req.user;

    if (!userId) return res.boom.unauthorized('Need to login first.');

    const { projectId } = req.params;

    if (!projectId) return res.boom.badRequest('ProjectId must be passed.');

    const project = await Project.findById(projectId)
      .populate('tasks')
      .populate({ path: 'user', select: 'name' });

    if (!project) return res.boom.notFound('Project not found');

    return res.json(project);
  }

  async update(req, res) {
    const { userId } = req.user;

    if (!userId) return res.boom.unauthorized('Need to login to update a project.');

    let { title, description, tasks } = req.body;

    if (!title) title = 'No title';

    if (!description) description = null;

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        title,
        description,
      },
      { new: true, useFindAndModify: false },
    );

    /**
         * Deleting tasks to add or modify new ones without duplicate
         */
    project.tasks = [];

    await Task.deleteMany({ project: project._id });

    /**
         * Handle and wait all tasks to be saved in project
         */

    await Promise.all(
      tasks.map(async (task) => {
        const projectTask = new Task({ ...task, project: project._id });

        await projectTask.save();

        project.tasks.push(projectTask);
      }),
    );

    await project.save();

    return res.json(project);
  }

  async delete(req, res) {
    const { projectId } = req.params;
    const { userId } = req.user;

    if (!userId) return res.boom.unauthorized('Need to login to delete a project.');

    if (!projectId) return res.boom.badRequest('ProjectId must be passed.');

    const deleted = await Project.deleteOne({ _id: projectId });

    if (deleted.ok !== 1) return res.boom.notFound('Project not found.');

    return res.send({ message: 'Project removed' });
  }
}

export default new ProjectController();
