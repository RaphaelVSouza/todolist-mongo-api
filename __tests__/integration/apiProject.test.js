import {
  describe, it, expect, beforeAll, afterAll,
} from '@jest/globals';
import request from 'supertest';
import Project from '../../src/app/schemas/Projects.js';
import factory from '../factories/factory';
import Mongo from '../../src/database/mongo';
import app from '../../src/app';

let project = {};
let tasks = [];
let projectId = '';
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

// Criar projetos com tarefas no banco pela rota /my-projects/create-project
// Ler projetos e suas tarefas pela rota /my-projects/all-projects usando limit
// Ler projetos e suas tarefas pela rota /my-projects/all-projects usando search
// Editar um projeto e suas tarefas pela rota /my-projects/:projectId/edit
// Excluir um projeto e suas tarefas pela rota /my-projects/:projectId/delete

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

  it('1 - Should create a Project on post in /my-projects/create-project', async () => {
    const response = await request(app)
      .post('/my-projects/create-project')
      .send({ ...project, tasks })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.project).toHaveProperty('_id');
    expect(response.body.project.tasks[0]).toHaveProperty('_id');
  });

  it('2 - Should find a Project on get in /my-projects/all-projects', async () => {
    const response = await request(app)
      .get('/my-projects/all-projects')
      .set('Authorization', `Bearer ${accessToken}`);
    projectId = response.body[0]._id;
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('_id');
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[0]).toHaveProperty('tasks');
  });

  it('3 - Should find a Project by id on get in /my-projects/:projectId/tasks', async () => {
    const response = await request(app)
      .get(`/my-projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(projectId);
  });

  it('4 - Should update a Project on put in /my-projects/:projectId/edit', async () => {
    const update = { title: 'A New Title' };

    const response = await request(app)
      .put(`/my-projects/${projectId}/edit`)
      .send(update)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(update.title);
  });

  it('5 - Should delete a Project on delete in /my-projects/:projectId/delete', async () => {
    const response = await request(app)
      .delete(`/my-projects/${projectId}/delete`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Project removed');
  });
});
