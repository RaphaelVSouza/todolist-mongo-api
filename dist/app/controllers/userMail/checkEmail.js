"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../../models/Users");
const UserMails_1 = require("../../models/UserMails");
async function checkEmail(req, res) {
    const token = req.params.verifyToken;
    const userMail = await UserMails_1.UserMail.findOne({ verifyEmailToken: token });
    if (!token || !userMail)
        return res.status(401).json({ error: 'Token invalid.' });
    const user = await Users_1.User.findById(userMail.user_id);
    if (user.isVerified === true)
        return res.status(403).json({ error: 'Email is already verified.' });
    const now = new Date();
    if (now > userMail.verifyEmailExpires)
        return res.status(403).json({ error: 'Expired token, generate a new one.' });
    user.isVerified = true;
    await user.save();
    return res.json({ message: 'Email verified successfully' });
}
exports.default = checkEmail;
