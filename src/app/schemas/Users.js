import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import Avatar from './Avatar';
import Project from './Projects';

const UserSchema = new mongoose.Schema(
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
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre('save', async function (next) {
  if (this.password) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

UserSchema.pre('remove', async function (next) {
  const avatar = await Avatar.findOne({ user_id: this._id });

  if (avatar) await avatar.remove();

  await Project.deleteMany({ user_id: this._id });

  next();
});

UserSchema.methods.generateAccessToken = function (params = {}) {
  return jwt.sign(params, authConfig.secret, { expiresIn: '2d' });
};

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
