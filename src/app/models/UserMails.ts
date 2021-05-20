import { Document, model, Model, Types, Schema } from 'mongoose'
import { IUserMail } from '../interfaces/userMail'

interface IUserMailSchema extends IUserMail, Document {
  verifyEmailToken: string
  verifyEmailExpires: Date
  user_id: Types.ObjectId | string
}

const UserMailSchema = new Schema(
  {
    verifyEmailToken: {
      type: String,
      required: true
    },

    verifyEmailExpires: {
      type: Date,
      required: true
    },

    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const UserMail = model<IUserMailSchema>('UserMail', UserMailSchema)

export { UserMail }
