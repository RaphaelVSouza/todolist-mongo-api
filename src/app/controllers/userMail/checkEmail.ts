import { User } from '../../models/Users'
import { UserMail } from '../../models/UserMails'

import { Response, Request } from 'express'

export default async function checkEmail(
  req: Request,
  res: Response
): Promise<Response> {
  const token = req.params.verifyToken

  const userMail = await UserMail.findOne({ verifyEmailToken: token })

  if (!token || !userMail)
    return res.status(401).json({ error: 'Token invalid.' })

  const user = await User.findById(userMail.user_id)

  if (user.isVerified === true)
    return res.status(403).json({ error: 'Email is already verified.' })

  const now = new Date()

  if (now > userMail.verifyEmailExpires)
    return res.status(403).json({ error: 'Expired token, generate a new one.' })

  user.isVerified = true

  await user.save()

  return res.json({ message: 'Email verified successfully' })
}
