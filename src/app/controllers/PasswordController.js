import crypto from 'crypto';
import User from '../schemas/Users.js';

import Queue from '../../lib/queue.js';
import ChangePassMail from '../jobs/ChangePassMail.js';

const apiUrl = process.env.SERVER_URL;

class PasswordController {
  async store(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.boom.notFound('User not found.');

    if (!user.isVerified) return res.boom.forbidden('Need to verify email first.');

    const resetToken = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1); // Token expires in 1 hour

    await User.findByIdAndUpdate(
      user.id,
      {
        $set: {
          passwordResetToken: resetToken,
          passwordResetExpires: now,
        },
      },
      { useFindAndModify: false },
    );

    await Queue.add(ChangePassMail.key, { email, apiUrl, resetToken });

    if (process.env.NODE_ENV !== 'production') {
      return res.json({ message: `Here is your reset token: ${resetToken}` });
    }

    return res.json({ message: 'Email successfully sent!' });
  }

  async update(req, res) {
    const { password } = req.body;
    const { resetToken } = req.params;

    const user = await User.findOne({ passwordResetToken: resetToken }).select(
      '+passwordResetToken +passwordResetExpires',
    );

    if (!user) return res.boom.notFound('User not found.');

    if (resetToken != user.passwordResetToken) return res.boom.unauthorized('Invalid token.');

    const now = new Date();

    if (now > user.passwordResetExpires) return res.boom.forbidden('Expired token, generate a new one.');

    user.password = password;

    await user.save();

    return res.json({ message: 'Password changed successfully!' });
  }
}

export default new PasswordController();
