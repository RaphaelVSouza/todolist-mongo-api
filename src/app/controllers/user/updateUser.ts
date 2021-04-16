import { User } from '../../models/Users';
import { Avatar } from '../../models/Avatar';

import { Request, Response } from 'express';
import { IAvatarFile } from '../../interfaces/avatarFile';
import { ISessionUser } from "../../interfaces/session";


export default async function createUser(req: Request, res: Response): Promise<Response> {
  const { userId } = req.user as ISessionUser;

  const { email = null, oldPassword = null } = req.body;

  const user = await User.findById(userId).select("+password");

  if (!user) return res.status(404).json({ error: "User not found." });

  if (email && user.email !== email) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: "User already exists." });
    }

    req.body.isVerified = false;
  }
  if (oldPassword) {
    if (!(await user.comparePassword(oldPassword)))
      return res.status(401).json({ error: "Invalid password." });
  }

  const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
    new: true,
  }).select("_id name email isVerified");

  const emptyAvatar = {
    originalname: null, size: null, filename: null, path: null
  }

  let { originalname, size, filename, path }: IAvatarFile = req.file || emptyAvatar;

  let newAvatar = {
    name: originalname,
    size,
    key: filename,
    url: path,
  };

  let avatar = await Avatar.findOne({ user_id: user._id });

  if (newAvatar.key) {
    avatar = new Avatar({ ...newAvatar, user_id: user._id });
    await avatar.save();
  }

  return res.json({
    message: "Data is successfully alterated",
    updatedUser,
    avatar,
  });
}
