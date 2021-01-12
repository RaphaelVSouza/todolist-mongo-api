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
const projectId = '';
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

describe.only('API Project Test Suite', () => {
  beforeAll(async () => {
    const userAttrs = await factory.attrs('User');
    userAttrs.isVerified = true;
    user = await factory.create('User', userAttrs);
    accessToken = await getAccessToken(userAttrs.email, userAttrs.password);
    await factory.create('Project');

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

  it('1 - Should create a Project on database', async () => {
    const response = await request(app)
      .post('/my-projects/create-project')
      .send({ ...project, tasks })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.tasks[0]).toHaveProperty('_id');
  });

  it('2 - Should find a Project from database', async () => {
    const LIMIT = 2;
    const response = await request(app)
      .get(`/my-projects/all-projects?limit=${LIMIT}`)
      .set('Authorization', `Bearer ${accessToken}`);
    console.log(response.body);
    expect(response.status).toBe(400);
  });
  /*
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
*/
  it('5 - Should close Database connection', async () => {});
});
