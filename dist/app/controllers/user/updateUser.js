"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../../models/Users");
const Avatar_1 = require("../../models/Avatar");
async function createUser(req, res) {
    const { userId } = req.user;
    const { email = null, oldPassword = null } = req.body;
    const user = await Users_1.User.findById(userId).select('+password');
    if (!user)
        return res.status(404).json({ error: 'User not found.' });
    if (email && user.email !== email) {
        const userExists = await Users_1.User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ error: 'User already exists.' });
        }
        req.body.isVerified = false;
    }
    if (oldPassword) {
        if (!(await user.comparePassword(oldPassword)))
            return res.status(401).json({ error: 'Invalid password.' });
    }
    const updatedUser = await Users_1.User.findOneAndUpdate({ _id: user._id }, req.body, {
        new: true
    }).select('_id name email');
    const emptyAvatar = {
        originalname: '',
        size: null,
        filename: '',
        location: ''
    };
    const { originalname, size, filename, path } = req.file || emptyAvatar;
    const newAvatar = {
        name: originalname,
        size,
        key: filename,
        url: path
    };
    let avatar = await Avatar_1.Avatar.findOne({ user_id: user._id });
    if (newAvatar.key) {
        avatar = new Avatar_1.Avatar(Object.assign(Object.assign({}, newAvatar), { user_id: user._id }));
        await avatar.save();
    }
    return res.json({
        message: 'Data is successfully alterated',
        updatedUser,
        avatar
    });
}
exports.default = createUser;
