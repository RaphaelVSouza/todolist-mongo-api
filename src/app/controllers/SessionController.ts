import { Request, Response } from 'express'
import { baseController } from './base/baseController'

import createSession from './session/createSession'

class SessionController extends baseController {
  store(req: Request, res: Response) {
    return createSession(req, res)
  }
}

export default new SessionController()
