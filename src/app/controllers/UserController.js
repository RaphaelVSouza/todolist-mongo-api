import User from '../schemas/Users.js';
import UserMailController from './UserMailController.js';

class UserController {
  async store(req, res) {
    const { email } = req.body;

    if (await User.findOne({ email })) return res.status(403).send({ error: 'User already exists' });

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

    if (!userId) return res.status(401).send({ error: 'You must be logged in' });

    const { email, oldPassword } = req.body;

    const user = await User.findById(userId).select('+password');

    if (email && user.email !== email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res.status(403).send({ error: 'User already exists.' });
      }
      UserMailController.sendConfirmationMail(userId, email);
      req.body.isVerified = false;
    }
    if (oldPassword) {
      if (!(await user.comparePassword(oldPassword, user.password))) return res.status(401).send({ error: 'Password does not match.' });
    }

    await user.updateOne(req.body);

    return res.json({ id: userId, message: 'Data is successfully alterated' });
  }

  async delete(req, res) {
    const { userId } = req.user;

    if (!userId) return res.status(401).send({ error: 'You must be logged in' });

    const user = await User.findById(userId).select('+password');

    const isDeleted = await User.deleteOne({ _id: user.id });

    if (isDeleted.ok !== 1) return res.status(500).send({ error: 'Internal error on delete user' });

    return res.json({ message: 'User is successfully deleted' });
  }
}

export default new UserController();
