
import { User } from '../../models/Users';

import { Request, Response } from 'express';

export default async function resetPassword(req: Request, res: Response): Promise<Response> {
    const { password } = req.body;
    const { resetToken } = req.params;

    const user = await User.findOne({ passwordResetToken: resetToken }).select(
      '+passwordResetToken +passwordResetExpires',
    );

    if (!user) return res.status(404).json({ error: 'User not found'})

    if (resetToken != user.passwordResetToken) return res.status(401).json({error: 'Invalid token.'})
    const now = new Date();

    if (now > user.passwordResetExpires) return res.status(401).json({ error: 'Current token is expired, generate a new one.'})

    user.password = password;

    await user.save();

    return res.json({ message: 'Password changed successfully!' });
  }



