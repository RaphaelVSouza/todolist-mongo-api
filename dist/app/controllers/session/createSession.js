"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../../models/Users");
const Avatar_1 = require("../../models/Avatar");
async function createSession(req, res) {
    const { email, password } = req.body;
    const user = await Users_1.User.findOne({ email }).select('id name +password isVerified');
    if (!user)
        return res.status(401).json({ error: 'Email or Password invalid.' });
    if (!user.isVerified)
        return res.status(401).json({ error: 'Need to verify email first.' });
    if (!(await user.comparePassword(password)))
        return res.status(401).json({ error: 'User or password invalid.' });
    const { name } = user;
    let avatar = await Avatar_1.Avatar.findOne({ user_id: user.id });
    if (!avatar)
        avatar = null;
    return res.json({
        name,
        email,
        accessToken: user.generateAccessToken({ id: user.id }),
        avatar
    });
}
exports.default = createSession;
