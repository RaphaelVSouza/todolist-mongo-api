import { User } from '../../models/Users'
import { Avatar } from '../../models/Avatar'
import SendMail from '../../services/UserMailService'

import { Request, Response } from 'express'
import { IAvatarFile } from '../../interfaces/avatarFile'

export default async function createUser(
  req: Request,
  res: Response
): Promise<Response> {
  const emptyAvatar = {
    originalname: '',
    size: null,
    filename: '',
    path: ''
  }

  const { name, password }: { name: string; password: string } = req.body

  let { email }: { email: string } = req.body
  email = email.toLowerCase()

  // Pick file properties if exists or send an empty avatar object

  const { originalname, size, filename, path }: IAvatarFile =
    req.file || emptyAvatar

  const userExists = await User.findOne({ email })

  if (userExists) return res.status(409).json({ error: 'User already exists.' })

  const user = await User.create({
    name,
    email,
    password
  })
  if (!user) throw Error('Error on creating a new user')

  await Avatar.create({
    name: originalname,
    size,
    key: filename,
    url: path,
    user_id: user._id
  })

  const { verifyToken } = await SendMail.sendConfirmationMail(user.id, email)

  if (process.env.NODE_ENV !== 'production') {
    return res.json({ message: `Access Token:${verifyToken}` })
  }

  return res.json({
    message: `A verify email is sent to ${email}`
  })
}
