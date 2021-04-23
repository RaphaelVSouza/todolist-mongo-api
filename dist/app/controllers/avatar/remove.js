"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarRemove = void 0;
const Avatar_1 = require("../../models/Avatar");
async function AvatarRemove(req, res) {
    const { userId } = req.user;
    const avatar = await Avatar_1.Avatar.findOne({ user_id: userId });
    if (!avatar)
        return res.status(404).json({ error: 'Avatar not found.' });
    await avatar.remove();
    return res.json({ message: 'Avatar is successfully removed' });
}
exports.AvatarRemove = AvatarRemove;
