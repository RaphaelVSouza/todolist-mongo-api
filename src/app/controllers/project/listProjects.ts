import { User } from '../../models/Users';
import { Project } from '../../models/Projects';
import { Task } from '../../models/Tasks';

import { Request, Response } from 'express';
import { ISessionUser } from '../../interfaces/session';

export default async function listProjects(req: Request, res: Response): Promise<Response> {
  const { userId } = req.user as ISessionUser;

    const { title , skip = 0 , limit = 10 } = req.query;

    const query = title
      ? { $and: [{ user_id: userId }, { title: { $regex: `.*${title}.*`, $options: "i" } }] }
      : { user_id: userId };

    const projects = await Project.find(query).skip(+skip).limit(+limit);

    return res.json({ projects });
}
