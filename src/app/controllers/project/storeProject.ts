import { User } from '../../models/Users'
import { Project } from '../../models/Projects'
import { Task } from '../../models/Tasks'

import { Request, Response } from 'express'
import { ISessionUser } from '../../interfaces/session'
import { IProject } from '../../interfaces/project'
import { ITask } from '../../interfaces/task'

export default async function storeProject(
  req: Request,
  res: Response
): Promise<Response> {
  const { userId } = req.user as ISessionUser

  const { description, tasks }: IProject = req.body
  let { title }: { title: string } = req.body

  if (!title) title = 'No title'

  const project = await Project.create({ title, description, user_id: userId })
  if (!project) throw Error('Error on create a new project')

  /**
   * Handle and wait all tasks to be saved at project
   **/

  if (tasks) {
    await Promise.all(
      tasks.map(async (task: ITask) => {
        const hasTitle = Object.prototype.hasOwnProperty.call(task, 'title')
        if (hasTitle) {
          if (!task.title) task.title = 'No title'

          const projectTask = new Task({
            title: task.title,
            project_id: project._id,
            user_id: userId
          })

          await projectTask.save()

          if (!project.tasks) throw Error('Cannot find project tasks')
          project.tasks.push(projectTask._id)
        }
      })
    )
    await project.save()
  }
  const user = await User.findById(userId)
  if (!user) return res.status(404).json({ error: 'User not found.' })

  user.projects.push(project.id)
  await user.save()

  return res.json({ project })
}
