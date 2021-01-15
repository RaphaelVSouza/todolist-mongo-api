import User from '../schemas/Users.js';
import Avatar from '../schemas/Avatar';
import SendMail from '../jobs/SendMail.js';

class UserController {
  async store(req, res) {
    const { email } = req.body;
    const {
      originalname: name = null, size = null, key = null, location: url = null,
    } = req.file || {};

    const userExists = await User.findOne({ email });

    if (userExists) return res.boom.conflict('User already exists.');

    const user = await User.create(req.body);

    const { id } = user;

    const { verifyToken } = await SendMail.sendConfirmationMail(id, email);

    const avatar = {
      name,
      size,
      key,
      url,
      user_id: id,
    };

    const userAvatar = new Avatar(avatar);
    await userAvatar.save();

    if (process.env.NODE_ENV !== 'production') {
      return res.json({
        message: `Here is your verify token:${verifyToken}`,
      });
    }
    return res.json({
      message: `A verify email is sent to ${email}`,
    });
  }

  async update(req, res) {
    const { userId } = req.user;
    const {
      originalname: name, size, key, location: url = null,
    } = req.file || {};
    let newAvatar = {
      name,
      size,
      key,
      url,
    };

    if (!userId) return res.boom.unauthorized('Need to login first.');

    const { email = null, oldPassword = null } = req.body;

    const user = await User.findById(userId).select('+password');

    if (email && user.email !== email) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.boom.conflict('User already exists.');
      }
      UserMailController.sendConfirmationMail(userId, email);
      req.body.isVerified = false;
    }
    if (oldPassword) {
      if (!(await user.comparePassword(oldPassword, user.password))) return res.boom.unauthorized('Invalid password.');
    }

    let avatar = await Avatar.findOne({ user_id: user._id });

    if (avatar && newAvatar.key) {
      avatar = new Avatar({ ...newAvatar, user_id: user._id });
      await avatar.save();
    }

    if (!avatar && newAvatar) {
      newAvatar = new Avatar(newAvatar);
      await newAvatar.save();
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, { new: true }).select(
      '_id name email isVerified',
    );

    return res.json({ message: 'Data is successfully alterated', updatedUser, avatar });
  }

  async delete(req, res) {
    const { userId } = req.user;

    if (!userId) return res.boom.unauthorized('Need to login first.');

    const user = await User.findById(userId).select('+password');

    const deletedUser = await user.remove();

    if (!deletedUser) return res.boom.forbidden('Error on delete user. Try again later.');

    return res.json({ message: 'User is successfully deleted' });
  }
}

export default new UserController();
