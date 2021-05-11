import { Avatar } from '../../models/Avatar';

import { Request, Response } from 'express';
import { ISessionUser } from '../../interfaces/session';

  export async function AvatarRemove (req: Request, res: Response): Promise<Response> {
    const { userId }  = req.user as ISessionUser;

    const avatar = await Avatar.findOne({ user_id: userId });
    if (!avatar) return res.status(404).json({error: 'Avatar not found.'})

    await avatar.remove();

    return res.json({ message: 'Avatar is successfully removed' });
  }

