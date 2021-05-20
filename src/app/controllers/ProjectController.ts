import { Request, Response } from 'express'

import { baseController } from './base/baseController'

import storeProject from './project/storeProject'
import listProjects from './project/listProjects'
import showProject from './project/showProject'
import updateProject from './project/updateProject'
import removeProject from './project/removeProject'

class ProjectController extends baseController {
  store(req: Request, res: Response): Promise<Response> {
    return storeProject(req, res)
  }

  index(req: Request, res: Response): Promise<Response> {
    return listProjects(req, res)
  }

  show(req: Request, res: Response): Promise<Response> {
    return showProject(req, res)
  }

  update(req: Request, res: Response): Promise<Response> {
    return updateProject(req, res)
  }

  delete(req: Request, res: Response): Promise<Response> {
    return removeProject(req, res)
  }
}

export default new ProjectController()
