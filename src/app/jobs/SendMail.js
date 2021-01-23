import crypto from 'crypto';
import Queue from '../../services/queue.js';
import VerifyMail from './VerifyMail.js';
import UserMail from '../schemas/UserMails';

const apiUrl = `${process.env.SERVER_HOST}${process.env.PORT}`;

class sendMail {
  static async sendConfirmationMail(id, email) {
    const verifyToken = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await UserMail.updateOne(
      { user_id: id },
      {
        verifyEmailToken: verifyToken,
        verifyEmailExpires: now,
        user_id: id,
      },
      { upsert: true },
    );

    if (process.env.NODE_ENV === 'production') {
      await Queue.add(VerifyMail.key, { email, apiUrl, verifyToken });
    }

    return { verifyToken };
  }
}

export default sendMail;
