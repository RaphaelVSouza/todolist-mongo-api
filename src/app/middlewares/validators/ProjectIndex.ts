import * as Yup from 'yup'

import { Request, Response, NextFunction } from 'express'

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const validationSchema = Yup.object({
      title: Yup.string().max(100),
      skip: Yup.number().min(0).max(999),
      limit: Yup.number().min(0).max(999)
    })

    await validationSchema.validate(req.query, { abortEarly: false })

    next()
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner })
  }
}
