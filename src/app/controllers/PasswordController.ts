import { Request, Response } from 'express';
import { baseController } from './base/baseController';
import storePasswordToken from './password/storePasswordToken';
import resetPassword from './password/resetPassword';

class PasswordController extends baseController{
  store(req: Request, res: Response): Promise<Response> {
   return storePasswordToken(req, res);
  }

  update(req: Request, res: Response): Promise<Response> {
    return resetPassword(req, res);
  }
}

export default new PasswordController();
