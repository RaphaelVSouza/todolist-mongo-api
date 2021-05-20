import { Project } from '../../models/Projects'
import { Task } from '../../models/Tasks'

import { Request, Response } from 'express'
import { ISessionUser } from '../../interfaces/session'
import { ITask } from '../../interfaces/task'
import { IProject } from '../../interfaces/project'

export default async function updateProject(
  req: Request,
  res: Response
): Promise<Response> {
  const { userId } = req.user as ISessionUser
  const { projectId } = req.params

  let { title, description }: IProject = req.body
  const { tasks }: { tasks: Array<ITask> } = req.body

  if (!title) title = 'No title'

  if (!description) description = null

  const project = await Project.findOneAndUpdate(
    { $and: [{ user_id: userId }, { _id: projectId }] },
    {
      title,
      description
    },
    { new: true, useFindAndModify: false }
  )

  if (!project) return res.status(404).json({ error: 'Project not found.' })

  /**
   * Deleting tasks to add or modify new ones without duplicate
   */
  if (tasks) {
    project.tasks = []

    await Task.deleteMany({ project_id: project._id })

    /**
     * Handle and wait all tasks to be saved in project
     */

    await Promise.all(
      tasks.map(async (task: ITask) => {
        const projectTask = new Task({
          ...task,
          project_id: project._id,
          user_id: userId
        })

        await projectTask.save()

        if (!project.tasks) throw Error('Cannot find project tasks')
        project.tasks.push(projectTask._id)
      })
    )

    await project.save()
  }

  return res.json({ project })
}
