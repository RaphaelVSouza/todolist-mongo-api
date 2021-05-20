import { Project } from '../../models/Projects'

import { Request, Response } from 'express'
import { ISessionUser } from '../../interfaces/session'

export default async function removeProject(
  req: Request,
  res: Response
): Promise<Response> {
  const { projectId } = req.params
  const { userId } = req.user as ISessionUser

  if (!projectId)
    return res.status(400).json({ error: 'Project ID must be passed.' })

  const project = await Project.findOne({
    $and: [{ user_id: userId }, { _id: projectId }]
  })

  if (!project) return res.status(404).json({ error: 'Project not found.' })

  await project.remove()

  return res.send({ message: 'Project removed' })
}
