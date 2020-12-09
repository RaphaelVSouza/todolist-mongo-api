import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.js';

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
    timestamps: true
},
);

UserSchema.pre('save', async function(next) {
    if(this.password) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }
    next();
})

UserSchema.methods.generateAccessToken = function(params = {}) {
    return jwt.sign( params, authConfig.secret, { expiresIn: '2d'} )
};

UserSchema.methods.comparePassword = async function(password, dbpassword) {
  return await bcrypt.compare(password, dbpassword)
};

const User = mongoose.model('User', UserSchema);

export default User;
