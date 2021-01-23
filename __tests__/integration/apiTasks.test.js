import {
  describe, it, expect, beforeAll, afterAll,
} from '@jest/globals';
import request from 'supertest';
import Project from '../../src/app/schemas/Projects.js';
import factory from '../factories/factory';
import Mongo from '../../src/database/mongo';
import app from '../../src/routes';

let project = {};
let tasks = [];
let projectId = '';
let taskId = '';
let user = {};
let accessToken = '';

async function getAccessToken(email, password) {
  const response = await request(app)
    .post('/login')
    .send({
      email,
      password,
    })
    .set('Accept', 'application/json');

  const { accessToken } = response.body;
  return accessToken;
}

describe('API Project Test Suite', () => {
  beforeAll(async () => {
    const userAttrs = await factory.attrs('User');
    userAttrs.isVerified = true;
    user = await factory.create('User', userAttrs);
    accessToken = await getAccessToken(userAttrs.email, userAttrs.password);

    project = await factory.attrs('Project');
    tasks = await factory.attrsMany('Task', 5);
  });

  afterAll(async () => {
    await user.remove();
    await Mongo.close();
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Disconnected');
  });

  it('0 - Should connect to the database', async () => {
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Connected');
  });

  it('1 - Should create a Project on use POST in /my-projects/create-project', async () => {
    const response = await request(app)
      .post('/my-projects/create-project')
      .send({ ...project, tasks })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.project).toHaveProperty('_id');
    expect(response.body.project.tasks[0]).toHaveProperty('_id');
  });

  it('2 - Should find a Project on use GET in /my-projects/all-projects', async () => {
    const response = await request(app)
      .get('/my-projects/all-projects')
      .set('Authorization', `Bearer ${accessToken}`);
    projectId = response.body[0]._id;
    taskId = response.body[0].tasks[0];

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('_id');
  });

  it('4 - Should update a Task on use PUT in /task/:taskId/edit', async () => {
    const response = await request(app)
      .put(`/task/${taskId}/edit`)
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(true);
  });

  it('5 - Should delete a Task on use DELETE in /task/:taskId/delete', async () => {
    const response = await request(app)
      .delete(`/task/${taskId}/delete`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task Successfully removed');
  });
});
