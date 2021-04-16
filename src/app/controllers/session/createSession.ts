import { User } from '../../models/Users';
import { Avatar } from '../../models/Avatar';

import { Request, Response } from 'express';
import { baseController } from './../base/baseController';

export default async function createSession(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('id name +password isVerified');

    if (!user) return res.status(401).json({ error: 'Email or Password invalid.'})

    if (!user.isVerified) return res.status(401).json({error: 'Need to verify email first.'})

    if (!(await user.comparePassword(password))) return res.status(401).json({error: 'User or password invalid.'});

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

