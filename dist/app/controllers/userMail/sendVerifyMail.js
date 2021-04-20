"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../../models/Users");
const UserMailService_1 = __importDefault(require("../../services/UserMailService"));
const UserMails_1 = require("../../models/UserMails");
async function sendVerifyMail(req, res) {
    const { email } = req.body;
    const user = await Users_1.User.findOne({ email });
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    if (user.isVerified === true)
        return res.status(403).json({ error: 'Email is already verified.' });
    const userMail = await UserMails_1.UserMail.findOne({ user_id: user._id });
    const now = new Date();
    if (now < userMail.verifyEmailExpires)
        return res.status(403).json({ error: 'Verify token isn\'t expired yet.' });
    await UserMailService_1.default.sendConfirmationMail(user._id, email);
    return res.json({ message: `Verify mail send to ${email} successfully.` });
}
exports.default = sendVerifyMail;
