import {
  describe, it, expect, beforeAll,
} from '@jest/globals';
import Project from '../../src/app/schemas/Projects.js';
import factory from '../factories/factory';
import Mongo from '../../src/database/mongo';

let project = {};
let projectId = '';

describe('Project Test Suite', () => {
  beforeAll(async () => {
    project = await factory.attrs('Project');
  });

  it('0 - Should connect to the database', async () => {
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Connected');
  });

  it('1 - Should create a Project on database', async () => {
    const createdProject = await Project.create(project);

    projectId = createdProject._id;
    expect(createdProject).toHaveProperty('_id');
  });

  it('2 - Should find a Project from database', async () => {
    const foundProject = await Project.findById(projectId);

    expect(foundProject._id).toEqual(projectId);
  });

  it('3 - Should update a Project from database', async () => {
    const query = { _id: projectId };
    const update = { title: 'A New Title' };

    const isUpdated = await Project.updateOne(query, update);

    expect(isUpdated.nModified && isUpdated.ok).toBe(1);
  });

  it('4 - Should delete a Project from database', async () => {
    const query = { _id: projectId };
    const isDeleted = await Project.deleteOne(query);

    expect(isDeleted.n && isDeleted.ok).toBe(1);
  });

  it('5 - Should close Database connection', async () => {
    await Mongo.close();
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Disconnected');
  });
});
