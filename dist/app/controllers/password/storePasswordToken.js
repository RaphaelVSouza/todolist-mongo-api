"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const Users_1 = require("../../models/Users");
const queue_1 = __importDefault(require("../../subscriber/queue"));
const ChangePassMail_1 = __importDefault(require("../../subscriber/jobs/ChangePassMail"));
async function storePassword(req, res) {
    const { email } = req.body;
    const user = await Users_1.User.findOne({ email })
        .select('+passwordResetToken +passwordResetExpires');
    ;
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    if (!user.isVerified)
        return res.status(401).json({ error: 'Need to verify email first.' });
    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1);
    if (user.passwordResetExpires && now < user.passwordResetExpires) {
        return res.status(403).json({ error: 'Reset token isn\'t expired yet.' });
    }
    user.passwordResetExpires = now;
    user.passwordResetToken = resetToken;
    await user.save();
    if (process.env.NODE_ENV === 'production') {
        const { FRONT_URL } = process.env;
        await queue_1.default.add(ChangePassMail_1.default.key, { email, FRONT_URL, resetToken });
    }
    if (process.env.NODE_ENV !== 'production') {
        return res.json({ message: `Here is your reset token:${resetToken}` });
    }
    return res.json({ message: 'Reset password mail successfully sent!' });
}
exports.default = storePassword;
