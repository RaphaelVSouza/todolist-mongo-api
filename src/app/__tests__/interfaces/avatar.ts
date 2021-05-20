import { Document } from 'mongoose'
import { IAvatar } from '../../interfaces/avatar'

interface IAvatarTest extends IAvatar, Document {
  user_id: string
}

export { IAvatarTest }
