"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../../models/Users");
const Avatar_1 = require("../../models/Avatar");
const UserMailService_1 = __importDefault(require("../../services/UserMailService"));
async function createUser(req, res) {
    const emptyAvatar = {
        originalname: '',
        size: null,
        filename: '',
        path: ''
    };
    const { name, password } = req.body;
    let { email } = req.body;
    email = email.toLowerCase();
    const { originalname, size, filename, path } = req.file || emptyAvatar;
    const userExists = await Users_1.User.findOne({ email });
    if (userExists)
        return res.status(409).json({ error: 'User already exists.' });
    const user = await Users_1.User.create({
        name,
        email,
        password
    });
    if (!user)
        throw Error('Error on creating a new user');
    await Avatar_1.Avatar.create({
        name: originalname,
        size,
        key: filename,
        url: path,
        user_id: user._id
    });
    const { verifyToken } = await UserMailService_1.default.sendConfirmationMail(user.id, email);
    if (process.env.NODE_ENV !== 'production') {
        return res.json({ message: `Access Token:${verifyToken}` });
    }
    return res.json({
        message: `A verify email is sent to ${email}`
    });
}
exports.default = createUser;
