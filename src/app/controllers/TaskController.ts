import { Request, Response } from 'express'
import { baseController } from './base/baseController'

import updateTask from './task/updateTask'
import removeTask from './task/removeTask'

class TaskController extends baseController {
  update(req: Request, res: Response): Promise<Response> {
    return updateTask(req, res)
  }

  delete(req: Request, res: Response): Promise<Response> {
    return removeTask(req, res)
  }
}

export default new TaskController()
