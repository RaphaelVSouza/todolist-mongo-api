import { Project } from '../../models/Projects'
import { Task } from '../../models/Tasks'
import { factory } from '../factories/factory'
import Mongo from '../../../database/mongo'
import { IUserTest } from '../interfaces/user'
import { ITaskTest } from '../interfaces/task'
import { IProjectTest } from '../interfaces/project'

let user: IUserTest
let tasks: Array<ITaskTest>
let taskId: string
let project: IProjectTest
let projectId: string

// Use --runInband to make tests run on order

describe('Tasks Test Suite', () => {
  beforeAll(async () => {
    const userAttrs = (await factory.attrs('User')) as IUserTest
    userAttrs.isVerified = true
    user = (await factory.create('User', userAttrs)) as IUserTest
    project = (await factory.create('Project', {
      user_id: user._id
    })) as IProjectTest
    projectId = project._id
    tasks = await factory.attrsMany<ITaskTest>('Task', 8)
  })

  it('1 - Should create Tasks on database', async () => {
    await Promise.all(
      tasks.map(async (task: any) => {
        const projectTask = new Task({
          title: task.title,
          project_id: project._id,
          user_id: user._id
        })
        await projectTask.save()
        project.tasks.push(projectTask._id)
      })
    )
    await project.save()
    const projectTasks = await Project.findById(projectId)
    taskId = projectTasks.tasks[0] as string
    expect(projectTasks.tasks[0]).toHaveProperty('_id')
  })

  it('3 - Should update a Task from database', async () => {
    const query = { _id: taskId }
    const update = { title: 'A  Task Title' }

    const isUpdated = await Task.updateOne(query, update)

    expect(isUpdated.nModified && isUpdated.ok).toBe(1)
  })

  it('4 - Should delete a Task from database', async () => {
    const query = { _id: taskId }
    const isDeleted = await Task.deleteOne(query)

    expect(isDeleted.n && isDeleted.ok).toBe(1)
  })

  it('5 - Should close Database connection', async () => {
    await Mongo.close()
    const connectionState = await Mongo.isConnected()

    expect(connectionState).toBe('Disconnected')
  })
})
