import * as Yup from 'yup'

import { Request, Response, NextFunction } from 'express'

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const validationSchema = Yup.object().shape({
      name: Yup.string().min(3).max(100).required(),
      email: Yup.string().email().min(3).max(100).required(),
      password: Yup.string().min(3).max(100).required(),
      confirmPassword: Yup.string().when('password', {
        is: (password) => !!(password && password.length > 0),
        then: Yup.string()
          .required()
          .oneOf([Yup.ref('password')])
      })
    })

    await validationSchema.validateSync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner })
  }
}
