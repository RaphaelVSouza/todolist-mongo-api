import { User } from '../../models/Users'
import MailService from '../../services/UserMailService'

import { Response, Request } from 'express'
import { UserMail } from '../../models/UserMails'

export default async function sendVerifyMail(
  req: Request,
  res: Response
): Promise<Response> {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) return res.status(404).json({ error: 'User not found' })

  if (user.isVerified === true)
    return res.status(403).json({ error: 'Email is already verified' })

  const userMail = await UserMail.findOne({ user_id: user._id })

  const now = new Date()

  if (now < userMail.verifyEmailExpires)
    return res.status(403).json({ error: "Token isn't expired yet" })

  await MailService.sendConfirmationMail(user._id, email)

  return res.json({ message: `Mail sent to ${email}` })
}
