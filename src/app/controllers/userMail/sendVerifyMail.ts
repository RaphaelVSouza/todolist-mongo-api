import { User } from '../../models/Users'
import MailService from '../../services/UserMailService'

import { Response, Request } from 'express';

export default async function sendVerifyMail (req: Request, res: Response): Promise<Response> {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) return res.status(404).json({ error: 'User not found' })

    await MailService.sendConfirmationMail(user._id, email)

    return res.json({ message: 'Email verified successfully' })
  }
