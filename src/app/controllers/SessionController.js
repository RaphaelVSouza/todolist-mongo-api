import bcrypt from 'bcryptjs';
import User from '../schemas/Users.js';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('id name +password isVerified');

    if (!user) return res.status(404).send({ error: 'User or password invalid' });

    if (!user.isVerified) return res.status(401).send({ error: 'Need to verify email first' });

    if (!(await bcrypt.compare(password, user.password))) return res.status(401).send({ error: 'User or password invalid' });

    const { id, name } = user;

    return res.json({
      id,
      name,
      email,
      accessToken: user.generateAccessToken({ id: user.id }),
    });
  }
}

export default new SessionController();
