import { Document, model, Model, Types, Schema, HookNextFunction } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth'
import { Avatar }  from './Avatar'
import { Project } from './Projects'

interface IUserSchema extends Document {
    name: string
    email: string
    password: string
    passwordResetToken?: string
    passwordResetExpires?: Date
    isVerified?: boolean
    projects?: Array<Types.ObjectId | string>
    comparePassword: (password: string) => {}
    generateAccessToken: (params: object) => {}
}

const UserSchema:any = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        passwordResetToken: {
            type: String,
            select: false,
            required: false,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
            required: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
            required: true,
        },
        projects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Project',
            },
        ],
    },
    {
        timestamps: true,
    }
)

UserSchema.pre('save', async function (this: IUserSchema, next: HookNextFunction) {
  if (this.email) {
      this.email = this.email.toLowerCase();
  }
  next()
})


UserSchema.pre('save', async function (this: IUserSchema, next: HookNextFunction) {
    if (this.password) {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
    }
    next()
})

UserSchema.pre('remove', async function (this: IUserSchema, next: HookNextFunction) {
    const avatar = await Avatar.findOne({ user_id: this._id })

    if (avatar.key) await avatar.remove()

    await Project.deleteMany({ user_id: this._id })

    next()
})

UserSchema.methods.generateAccessToken = function (params = {}) {
    const { secret } = authConfig
    if (!secret) {
        throw Error('Secret must be passed')
    }
    return jwt.sign(params, secret, { expiresIn: '2d' })
}

UserSchema.methods.comparePassword = function (password: string) {
    return bcrypt.compare(password, this.password)
}

const User: Model<IUserSchema> = model('User', UserSchema)

export { User }
