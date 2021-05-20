import { Task } from '../../models/Tasks'

import { Request, Response } from 'express'
import { ISessionUser } from '../../interfaces/session'

export default async function removeProject(
  req: Request,
  res: Response
): Promise<Response> {
  const { userId } = req.user as ISessionUser
  const { taskId } = req.params

  if (!taskId) return res.status(400).json({ error: 'Task ID must be passed.' })

  const task = await Task.findOne({
    $and: [{ user_id: userId }, { _id: taskId }]
  })

  if (!task) return res.status(404).json({ error: 'Task not found.' })

  task.completed ? (task.completed = false) : (task.completed = true)

  task.save()

  return res.json(task)
}
