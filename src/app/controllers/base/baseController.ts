import { Request, Response } from 'express';

abstract class baseController {

   store(req: Request, res: Response) {
    throw Error(`Method store of ${this} is not implemented yet.`)
  }

   show(req: Request, res: Response) {
    throw Error(`Method show of ${this} is not implemented yet.`)
  }

   index(req: Request, res: Response) {
    throw Error(`Method index of ${this} is not implemented yet.`)
  }

   update(req: Request, res: Response) {
    throw Error(`Method update of ${this} is not implemented yet.`)
  }

   remove(req: Request, res: Response) {
    throw Error(`Method remove of ${this} is not implemented yet.`)
  }
}

export { baseController };
