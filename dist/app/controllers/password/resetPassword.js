"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../../models/Users");
async function resetPassword(req, res) {
    const { password } = req.body;
    const { resetToken } = req.params;
    const user = await Users_1.User.findOne({ passwordResetToken: resetToken }).select('+passwordResetToken +passwordResetExpires');
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    if (resetToken != user.passwordResetToken)
        return res.status(401).json({ error: 'Invalid token.' });
    const now = new Date();
    if (now > user.passwordResetExpires)
        return res.status(401).json({ error: 'Current token is expired, generate a new one.' });
    user.password = password;
    await user.save();
    return res.json({ message: 'Password changed successfully!' });
}
exports.default = resetPassword;
