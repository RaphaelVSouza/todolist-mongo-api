import request from 'supertest'
import { factory } from '../factories/factory'
import Mongo from '../../../database/mongo'
import app from '../../../app'
import { IProjectTest } from '../interfaces/project'
import { ITaskTest } from '../interfaces/task'
import { IUserTest } from '../interfaces/user'

let project: IProjectTest
let tasks: Array<ITaskTest>
let taskId: string
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

describe('API Task Test Suite', () => {
  beforeAll(async () => {
    const userAttrs = (await factory.attrs('User')) as IUserTest
    userAttrs.isVerified = true
    user = (await factory.create('User', userAttrs)) as IUserTest
    accessToken = await getAccessToken(userAttrs.email, userAttrs.password)

    project = await factory.attrs('Project')
    tasks = await factory.attrsMany('Task', 5)
  })

  afterAll(async () => {
    await user.remove()
    await Mongo.close()
  })

  it('1 - Should create a Project on use POST in /my-projects/create-project', async () => {
    const response = await request(app)
      .post('/my-projects/create-project')
      .send({ ...project, tasks: tasks })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)

    taskId = response.body.project.tasks[0]
    expect(response.status).toBe(200)
    expect(response.body.project).toHaveProperty('_id')
    expect(response.body.project).toHaveProperty('tasks')
  })

  it('2 - Should update a Task on use PUT in /task/:taskId/edit', async () => {
    const response = await request(app)
      .put(`/task/${taskId}/edit`)
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.completed).toBe(true)
  })

  it('3 - Should delete a Task on use DELETE in /task/:taskId/delete', async () => {
    const response = await request(app)
      .delete(`/task/${taskId}/delete`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Task Successfully removed')
  })
})
