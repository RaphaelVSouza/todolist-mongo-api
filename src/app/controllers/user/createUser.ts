import { User } from '../../models/Users';
import { Avatar } from '../../models/Avatar';
import SendMail from '../../services/UserMailService';

import { Request, Response } from 'express';
import { IAvatarFile } from '../../interfaces/avatarFile';

export default async function createUser(req: Request, res: Response): Promise<Response> {

  const emptyAvatar = {
    originalname: '', size: null, key: '', location: ''
  }

  const { email } = req.body;

  // Pick file properties if exists or send an empty avatar object
console.log(req.file)
    let { originalname: name, size, key, location: url }: IAvatarFile = req.file || emptyAvatar;


  const userExists = await User.findOne({ email });

  if (userExists)
    return res.status(409).json({ error: "User already exists." });

  const user = await User.create(req.body);
  if(!user) throw Error('Error on creating a new user')

  const { verifyToken } = await SendMail.sendConfirmationMail(user.id, email);

   const avatar = await Avatar.create(
      {
        name,
        size,
        key,
        url,
        user_id: user._id
      })

      if(avatar) console.log(avatar)

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
