import * as Yup from 'yup';

import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const validationSchema = Yup.object().shape({
      name: Yup.string().max(100),
      oldPassword: Yup.string().max(100),
      password: Yup.string().when('oldPassword', {
        is: (oldPassword) => !!(oldPassword && oldPassword.length > 0),
        then: Yup.string().required(),
      }),
      confirmPassword: Yup.string().when('password', {
        is: (password) => !!(password && password.length > 0),
        then: Yup.string()
          .required()
          .oneOf([Yup.ref('password')]),
      }),
    });

    await validationSchema.validate(req.body, { abortEarly: false });

    next();
  } catch (err) {
    return res.status(400).json({ error: 'Validation fails', messages: err.inner });
  }
};
