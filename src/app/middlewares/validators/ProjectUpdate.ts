import * as Yup from 'yup';

import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const validationSchema = Yup.object().shape({
      title: Yup.string().min(1).max(100),
      description: Yup.string().min(1).max(100),
      tasks: Yup.array()
        .of(
          Yup.object().shape({
            title: Yup.string().min(1).max(100),
          }),
        )
        .min(0)
        .max(50),
    });

    await validationSchema.validate(req.body, { abortEarly: false });

    next();
  } catch (err) {
    return res.status(400).json({ error: 'Validation fails', messages: err.inner });
  }
};
