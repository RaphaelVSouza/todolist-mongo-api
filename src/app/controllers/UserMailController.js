import crypto from 'crypto';
import User from '../schemas/Users.js';
import Queue from '../../lib/queue.js';
import VerifyMail from '../jobs/VerifyMail.js';
import UserMail from '../schemas/UserMails';

const apiUrl = `${process.env.SERVER_HOST}${process.env.PORT}`;

class UserMailController {
  async sendConfirmationMail(id, email) {
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

    await Queue.add(VerifyMail.key, { email, apiUrl, verifyToken });

    return { verifyToken };
  }

  async verifyEmail(req, res) {
    const token = req.params.verifyToken;

    const userMail = await UserMail.findOne({ verifyEmailToken: token });

    if (!token || !userMail) return res.boom.unauthorized('Token invalid.');

    const user = await User.findById(userMail.user_id);

    if (user.isVerified === true) return res.boom.forbidden('Email is already verified.');

    const now = new Date();

    if (now > userMail.verifyEmailExpires) return res.boom.forbidden('Expired token, generate a new one.');

    user.isVerified = true;

    await user.save();

    return res.json({ message: 'Email verified successfully' });
  }
}

export default new UserMailController();
