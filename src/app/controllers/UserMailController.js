import User from '../schemas/Users.js';
import UserMail from '../schemas/UserMails';
import sendMail from '../jobs/SendMail';

class UserMailController {
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

  async resendVerifyMail(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.boom.notFound('User not found');

    await sendMail.sendConfirmationMail(user._id, email);

    return res.json({ message: 'Email verified successfully' });
  }
}

export default new UserMailController();
