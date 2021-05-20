import { Response, Request } from 'express'
import { baseController } from './base/baseController'

import sendVerifyMail from './userMail/sendVerifyMail'
import checkEmail from './userMail/checkEmail'

class UserMailController extends baseController {
  sendVerificationMail(req: Request, res: Response): Promise<Response> {
    return sendVerifyMail(req, res)
  }

  verifyEmail(req: Request, res: Response): Promise<Response> {
    return checkEmail(req, res)
  }
}

export default new UserMailController()
