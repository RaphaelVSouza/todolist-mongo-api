import { Project } from '../../models/Projects'

import { Request, Response } from 'express'
import { ISessionUser } from '../../interfaces/session'

export default async function showProject(
  req: Request,
  res: Response
): Promise<Response> {
  const { userId } = req.user as ISessionUser

  const { projectId } = req.params

  if (!projectId)
    return res.status(400).json({ error: 'Project ID must be passed.' })

  const project = await Project.find({
    $and: [{ user_id: userId }, { _id: projectId }]
  }).populate('tasks')

  if (!project) return res.status(404).json({ error: 'Project not found' })

  return res.json({ project })
}
