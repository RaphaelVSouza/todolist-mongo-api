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
    verifyEmailToken: {
        type: String,
        select: false,
    },
    verifyEmailExpires: {
        type: Date,
        select: false,
    },
    verifiedEmail: {
        type: Boolean,
        default: false,
    },
    passwordResetToken: {
        type: String,
      select: false,
    },
    passwordResetExpires: {
        type: Date,
      select: false,
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

UserSchema.methods.generateToken = function(params = {}) {
    return jwt.sign( params, authConfig.secret, { expiresIn: '2d'} )
};

const User = mongoose.model('User', UserSchema);

export default User;