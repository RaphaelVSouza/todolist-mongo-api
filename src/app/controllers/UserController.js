import User from '../schemas/Users.js';
import UserMailController from './UserMailController.js';

class UserController {
  async store(req, res) {
    const { email } = req.body;

    if (await User.findOne({ email })) return res.boom.conflict('User already exists.');

    const user = await User.create(req.body);

    const { id } = user;

    const { verifyToken } = await UserMailController.sendConfirmationMail(id, email);

    if (process.env.NODE_ENV !== 'production') {
      return res.json({
        message: `Here is your verify token: ${verifyToken}`,
      });
    }
    return res.json({
      message: `A verify email is sent to ${email}`,
    });
  }

  async update(req, res) {
    const { userId } = req.user;

    if (!userId) return res.boom.unauthorized('Need to login first.');

    const { email, oldPassword } = req.body;

    const user = await User.findById(userId).select('+password');

    if (email && user.email !== email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res.boom.conflict('User already exists.');
      }
      UserMailController.sendConfirmationMail(userId, email);
      req.body.isVerified = false;
    }
    if (oldPassword) {
      if (!(await user.comparePassword(oldPassword, user.password))) return res.boom.unauthorized('Invalid password.');
    }

    await user.updateOne(req.body);

    return res.json({ id: userId, message: 'Data is successfully alterated' });
  }

  async delete(req, res) {
    const { userId } = req.user;

    if (!userId) return res.boom.unauthorized('Need to login first.');

    const user = await User.findById(userId).select('+password');

    const deleted = await User.deleteOne({ _id: user.id });

    if (deleted.ok !== 1) return res.boom.forbidden('Error on delete user. Try again later.');

    return res.json({ message: 'User is successfully deleted' });
  }
}

export default new UserController();
