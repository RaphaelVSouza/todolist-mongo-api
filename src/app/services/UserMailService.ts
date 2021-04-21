import crypto from 'crypto'
import Queue from '../subscriber/queue'
import VerifyMail from '../subscriber/jobs/VerifyMail'
import { UserMail } from '../models/UserMails'
import { Types } from 'mongoose';

class MailService {
  static async sendConfirmationMail (id: Types.ObjectId , email: string) {
    const verifyToken = crypto.randomBytes(20).toString('hex')

    const now = new Date()
    now.setHours(now.getHours() + 1)

    await UserMail.updateOne(
      { user_id: id },
      {
        verifyEmailToken: verifyToken,
        verifyEmailExpires: now,
        user_id: id
      },
      { upsert: true }
    )

    if (process.env.NODE_ENV === 'production') {
      const { FRONT_URL } = process.env
      await Queue.add(VerifyMail.key, { email, FRONT_URL, verifyToken })
      }

    return { verifyToken }
  }
}

export default MailService;
