import request from 'supertest'
import { factory } from '../factories/factory'
import Mongo from '../../../database/mongo'
import app from '../../../app'
import { IProjectTest } from '../interfaces/project'
import { IUserTest } from '../interfaces/user'
import { ITaskTest } from '../interfaces/task'

let project: IProjectTest
let tasks: Array<ITaskTest>
let projectId: string
let user: IUserTest
let accessToken: string

async function getAccessToken(email: string, password: string) {
  const response = await request(app)
    .post('/login')
    .send({
      email,
      password
    })
    .set('Accept', 'application/json')

  const { accessToken } = response.body
  return accessToken
}

describe('API Project Test Suite', () => {
  beforeAll(async () => {
    const userAttrs = (await factory.attrs('User')) as IUserTest
    userAttrs.isVerified = true
    user = (await factory.create('User', userAttrs)) as IUserTest
    accessToken = await getAccessToken(userAttrs.email, userAttrs.password)

    project = (await factory.attrs('Project', {
      user_id: user._id
    })) as IProjectTest
    tasks = await factory.attrsMany('Task', 5)
  })

  afterAll(async () => {
    await user.remove()
    await Mongo.close()
  })

  it('1 - Should create a Project on use POST in /my-projects/create-project', async () => {
    const response = await request(app)
      .post('/my-projects/create-project')
      .send({ ...project, tasks })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)

    const newProject = response.body.project as IProjectTest

    expect(response.status).toBe(200)
    expect(newProject).toHaveProperty('_id')
    expect(newProject).toHaveProperty('tasks')
  })

  it('2 - Should find a Project on use GET in /my-projects/all-projects', async () => {
    const response = await request(app)
      .get('/my-projects/all-projects')
      .set('Authorization', `Bearer ${accessToken}`)

    const findedProject = response.body.projects[0] as IProjectTest

    projectId = findedProject._id

    expect(response.status).toBe(200)
    expect(findedProject).toHaveProperty('_id')
    expect(findedProject).toHaveProperty('title')
    expect(findedProject).toHaveProperty('tasks')
  })

  it('3 - Should find a Project by id on use GET in /my-projects/:projectId/tasks', async () => {
    const response = await request(app)
      .get(`/my-projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.project[0]._id).toBe(projectId)
  })

  it('4 - Should update a Project on use PUT in /my-projects/:projectId/edit', async () => {
    const update = { title: 'A New Title' }

    const response = await request(app)
      .put(`/my-projects/${projectId}/edit`)
      .send(update)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)

    const updatedProject = response.body.project as IProjectTest

    expect(response.status).toBe(200)
    expect(updatedProject.title).toBe(update.title)
  })

  it('5 - Should delete a Project on use DELETE in /my-projects/:projectId/delete', async () => {
    const response = await request(app)
      .delete(`/my-projects/${projectId}/delete`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Project removed')
  })
})
