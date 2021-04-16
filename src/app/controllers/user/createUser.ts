import { User } from '../../models/Users';
import { Avatar } from '../../models/Avatar';
import SendMail from '../../services/UserMailService';

import { Request, Response } from 'express';
import { IAvatarFile } from '../../interfaces/avatarFile';

export default async function createUser(req: Request, res: Response): Promise<Response> {

  const emptyAvatar = {
    originalname: null, size: null, filename: null, path: null
  }

  const { email } = req.body;

  // Pick file properties if exists or send an empty avatar object

    let { originalname, size, filename, path }: IAvatarFile = req.file || emptyAvatar;


  const userExists = await User.findOne({ email });

  if (userExists)
    return res.status(409).json({ error: "User already exists." });

  const user = await User.create(req.body);
  if(!user) throw Error('Error on creating a new user')

  const { verifyToken } = await SendMail.sendConfirmationMail(user.id, email);

    await Avatar.create(
      {
        name: originalname,
        size: size,
        key: filename,
        url: path,
        user_id: user._id
      })

  if (process.env.NODE_ENV !== "production") {

    return res.json({

      message: `Here is your verify token:${verifyToken}`,
    });
  } else {

    return res.json({
      message: `A verify email is sent to ${email}`,
    });
  }
}
