import { User } from '../../models/Users';

import { Request, Response } from 'express';
import { ISessionUser } from "../../interfaces/session";


export default async function removeUser(req: Request, res: Response): Promise<Response> {
  const { userId } = req.user as ISessionUser;

  const user = await User.findById(userId).select("+password");

  if(!user) return res.status(404).json({ error: 'User not found.'})

  const deletedUser = await user.remove();

  if (!deletedUser)
    return res
      .status(403)
      .json({ error: "Error on deleting user. Try again later." });

  return res.json({ message: "User is successfully removed" });
}
