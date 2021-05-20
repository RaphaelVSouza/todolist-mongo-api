import * as Yup from 'yup'

import { Request, Response, NextFunction } from 'express'

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const validationSchema = Yup.object().shape({
      email: Yup.string().email().min(1).max(100).required()
    })

    await validationSchema.validate(req.body, { abortEarly: false })

    next()
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner })
  }
}
