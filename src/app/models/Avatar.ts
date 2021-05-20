import {
  Document,
  model,
  Model,
  Types,
  Schema,
  HookNextFunction
} from 'mongoose'
import { S3 } from 'aws-sdk'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { IAvatar } from '../interfaces/avatar'

const s3 = new S3()

interface IAvatarSchema extends IAvatar, Document {
  user_id: Types.ObjectId | string
}

const AvatarSchema = new Schema({
  name: {
    type: String,
    required: false
  },
  size: {
    type: Number,
    required: false
  },
  key: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: false
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

AvatarSchema.pre(
  'save',
  function (this: IAvatarSchema, next: HookNextFunction) {
    if (!this.url && this.key) {
      const LOCAL_API_URL = `${process.env.SERVER_HOST}${process.env.PORT}`

      this.url = `${LOCAL_API_URL}/files/${this.key}`
    }

    next()
  }
)

AvatarSchema.pre(
  'remove',
  async function (this: IAvatarSchema, next: HookNextFunction) {
    if (process.env.STORAGE_TYPE === 's3') {
      return s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: this.key
        })
        .promise()
        .then((response) => {
          console.log(response)
        })
        .catch((response) => {
          console.log(response.status)
        })
    } else {
      console.log(this)
      return promisify(fs.unlink)(
        path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', this.key)
      )
    }
  }
)

const Avatar: Model<IAvatarSchema> = model('Avatar', AvatarSchema)

export { Avatar }
