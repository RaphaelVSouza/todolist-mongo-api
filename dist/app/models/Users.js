"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../config/auth"));
const Avatar_1 = require("./Avatar");
const Projects_1 = require("./Projects");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false,
        required: false
    },
    passwordResetExpires: {
        type: Date,
        select: false,
        required: false
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    projects: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Project'
        }
    ]
}, {
    timestamps: true
});
UserSchema.pre('save', async function (next) {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
});
UserSchema.pre('save', async function (next) {
    if (this.password) {
        const hash = await bcryptjs_1.default.hash(this.password, 10);
        this.password = hash;
    }
    next();
});
UserSchema.pre('remove', async function (next) {
    const avatar = await Avatar_1.Avatar.findOne({ user_id: this._id });
    if (avatar.key)
        await avatar.remove();
    await Projects_1.Project.deleteMany({ user_id: this._id });
    next();
});
UserSchema.methods.generateAccessToken = function (params = {}) {
    const { secret } = auth_1.default;
    if (!secret) {
        throw Error('Secret must be passed');
    }
    return jsonwebtoken_1.default.sign(params, secret, { expiresIn: '2d' });
};
UserSchema.methods.comparePassword = function (password) {
    return bcryptjs_1.default.compare(password, this.password);
};
const User = mongoose_1.model('User', UserSchema);
exports.User = User;
