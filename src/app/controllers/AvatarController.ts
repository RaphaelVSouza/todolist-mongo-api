import { AvatarRemove } from './avatar/remove'
import { baseController } from './base/baseController';
import { Request, Response } from 'express';

class AvatarController extends baseController{
  delete(req: Request, res: Response) {
    return AvatarRemove(req, res)
  }

}

export default new AvatarController();
