import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({error:'Page not found.'});
  next();
};
