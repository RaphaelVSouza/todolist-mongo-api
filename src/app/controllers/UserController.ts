import { Request, Response } from "express";
import { baseController } from "./base/baseController";

import createUser from './user/createUser';
import updateUser from './user/updateUser';
import removeUser from './user/removeUser';

class UserController extends baseController {
  async store(req: Request, res: Response): Promise<Response> {
    return createUser(req, res);

  }

  async update(req: Request, res: Response): Promise<Response> {
    return updateUser(req, res);

  }

  async delete(req: Request, res: Response): Promise<Response> {
    return removeUser(req, res);

  }
}

export default new UserController();
