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
        originalname: '', size: null, key: '', location: ''
    };
    const { email } = req.body;
    let { originalname: name, size, key, location: url } = req.file || emptyAvatar;
    const userExists = await Users_1.User.findOne({ email });
    if (userExists)
        return res.status(409).json({ error: "User already exists." });
    const user = await Users_1.User.create(req.body);
    if (!user)
        throw Error('Error on creating a new user');
    const { verifyToken } = await UserMailService_1.default.sendConfirmationMail(user.id, email);
    await Avatar_1.Avatar.create({
        name,
        size,
        key,
        url,
        user_id: user._id
    });
    if (process.env.NODE_ENV !== "production") {
        return res.json({
            message: `Here is your verify token:${verifyToken}`,
        });
    }
    else {
        return res.json({
            message: `A verify email is sent to ${email}`,
        });
    }
}
exports.default = createUser;
