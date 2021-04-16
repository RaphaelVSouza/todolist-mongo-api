import { Document, model, Model, Types, Schema, HookNextFunction } from 'mongoose'
//import { S3 } from 'aws-sdk'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { IAvatar } from '../interfaces/avatar'

//const s3 = new S3()

interface IAvatarSchema extends IAvatar, Document {

    user_id: Types.ObjectId | string
}

const AvatarSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    size: {
        type: Number,
        required: false,
    },
    key: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: false,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

AvatarSchema.pre('save', function (this: IAvatarSchema, next: HookNextFunction) {
    const LOCAL_API_URL = `${process.env.SERVER_HOST}${process.env.PORT}`

    if (!this.url) {
        this.url = `${LOCAL_API_URL}/files/${this.key}`
    }

    next();
})

AvatarSchema.pre('remove', async function (this: IAvatarSchema, next: HookNextFunction) {
    if (this.key) {
        await promisify(fs.unlink)(
            path.resolve(
                __dirname,
                '..',
                '..',
                '..',
                'tmp',
                'uploads',
                this.key
            )
        )
    }

    next()
})

const Avatar: Model<IAvatarSchema> = model('Avatar', AvatarSchema)

export { Avatar }
