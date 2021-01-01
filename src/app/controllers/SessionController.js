import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../schemas/Users.js';
import UserMail from '../schemas/UserMails';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('id name +password isVerified');

    if (!user) return res.status(404).send({ error: 'User not found' });

    if (!user.isVerified) return res.status(401).send({ error: 'Need to verify email first' });

    if (!(await bcrypt.compare(password, user.password))) return res.status(401).send({ error: 'Invalid password' });

    const { id, name } = user;

    return res.json({
      id, name, email, accessToken: user.generateAccessToken({ id: user.id }),
    });
  }

  async update(req, res) {}
}

export default new SessionController();
