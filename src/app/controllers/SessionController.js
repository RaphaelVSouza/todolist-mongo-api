import User from '../schemas/Users.js';
import Avatar from '../schemas/Avatar';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('id name +password isVerified');

    if (!user) return res.boom.unauthorized('User or password invalid.');

    if (!user.isVerified) return res.boom.unauthorized('Need to verify email first.');

    if (!(await user.comparePassword(password))) return res.boom.unauthorized('User or password invalid.');

    const { id, name } = user;

    let avatar = await Avatar.findOne({ user_id: user.id });

    if (!avatar) avatar = null;

    return res.json({
      id,
      name,
      email,
      accessToken: user.generateAccessToken({ id: user.id }),
      avatar,
    });
  }
}

export default new SessionController();
