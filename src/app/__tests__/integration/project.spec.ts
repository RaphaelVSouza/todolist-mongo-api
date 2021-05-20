import { Project } from '../../models/Projects'
import { factory } from '../factories/factory'
import Mongo from '../../../database/mongo'
import { IUserTest } from '../interfaces/user'
import { IProjectTest } from '../interfaces/project'

let project: IProjectTest
let projectId: string
let user: IUserTest

describe('Project Test Suite', () => {
  beforeAll(async () => {
    const userAttrs = (await factory.attrs('User')) as IUserTest
    userAttrs.isVerified = true
    user = (await factory.create('User', userAttrs)) as IUserTest
    project = (await factory.attrs('Project')) as IProjectTest
  })

  it('1 - Should create a Project on database', async () => {
    const { title, description } = project
    const createdProject = await Project.create({
      title,
      description,
      user_id: user._id
    })

    projectId = createdProject._id
    expect(createdProject).toHaveProperty('_id')
  })

  it('2 - Should find a Project from database', async () => {
    const foundProject = await Project.findById(projectId)

    expect(foundProject._id).toEqual(projectId)
  })

  it('3 - Should update a Project from database', async () => {
    const query = { _id: projectId }
    const update = { title: 'A New Title' }

    const isUpdated = await Project.updateOne(query, update)

    expect(isUpdated.nModified && isUpdated.ok).toBe(1)
  })

  it('4 - Should delete a Project from database', async () => {
    const query = { _id: projectId }
    const isDeleted = await Project.deleteOne(query)

    expect(isDeleted.n && isDeleted.ok).toBe(1)
  })

  it('5 - Should close Database connection', async () => {
    await Mongo.close()
    const connectionState = await Mongo.isConnected()

    expect(connectionState).toBe('Disconnected')
  })
})
