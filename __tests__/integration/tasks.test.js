import {
  describe, it, expect, beforeAll,
} from '@jest/globals';
import faker from 'faker';
import Project from '../../src/app/schemas/Projects.js';
import Task from '../../src/app/schemas/Tasks.js';
import factory from '../factories/factory';
import Mongo from '../../src/database/mongo';

let tasks = [];
let taskId = '';
let project = {};
let projectId = '';

// Use --runInband to make tests run on order

describe('Tasks Test Suite', () => {
  beforeAll(async () => {
    project = await factory.create('Project');
    projectId = project._id;
    tasks = await factory.attrsMany('Task', 8, { title: faker.name.jobTitle() });
  });

  it('0 - Should connect to the database', async () => {
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Connected');
  });

  it('1 - Should create Tasks on database', async () => {
    await Promise.all(
      tasks.map(async (task) => {
        const projectTask = new Task({ title: task.title, project_id: project._id });
        await projectTask.save();
        project.tasks.push(projectTask);
      }),
    );
    await project.save();
    const projectTasks = await Project.findById(projectId);
    taskId = projectTasks.tasks[0]._id;
    expect(projectTasks.tasks[0]).toHaveProperty('_id');
  });

  it('3 - Should update a Task from database', async () => {
    const query = { _id: taskId };
    const update = { title: 'A  Task Title' };

    const isUpdated = await Task.updateOne(query, update);

    expect(isUpdated.nModified && isUpdated.ok).toBe(1);
  });

  it('4 - Should delete a Task from database', async () => {
    const query = { _id: taskId };
    const isDeleted = await Task.deleteOne(query);

    expect(isDeleted.n && isDeleted.ok).toBe(1);
  });

  it('5 - Should close Database connection', async () => {
    await Mongo.close();
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Disconnected');
  });
});
