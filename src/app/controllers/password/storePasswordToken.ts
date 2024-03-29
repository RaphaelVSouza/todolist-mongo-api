import crypto from 'crypto'
import { User } from '../../models/Users'

import Queue from '../../subscriber/queue'
import ChangePassMail from '../../subscriber/jobs/ChangePassMail'

import { Request, Response } from 'express'

export default async function storePassword(
  req: Request,
  res: Response
): Promise<Response> {
  const { email } = req.body

  const user = await User.findOne({ email }).select(
    '+passwordResetToken +passwordResetExpires'
  )

  if (!user) return res.status(404).json({ error: 'User not found' })

  if (!user.isVerified)
    return res.status(401).json({ error: 'Need to verify email first.' })

  const resetToken = crypto.randomBytes(20).toString('hex')

  const now = new Date()
  now.setHours(now.getHours() + 1) // Token expires in 1 hour

  if (user.passwordResetExpires && now < user.passwordResetExpires) {
    return res.status(403).json({ error: "Reset token isn't expired yet." })
  }

  user.passwordResetExpires = now
  user.passwordResetToken = resetToken

  await user.save()

  if (process.env.NODE_ENV === 'production') {
    const { FRONT_URL } = process.env
    await Queue.add(ChangePassMail.key, { email, FRONT_URL, resetToken })
  }

  if (process.env.NODE_ENV !== 'production') {
    return res.json({ message: `Here is your reset token:${resetToken}` })
  }

  return res.json({ message: 'Reset password mail successfully sent!' })
}
