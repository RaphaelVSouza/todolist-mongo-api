"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../../models/Users");
async function removeUser(req, res) {
    const { userId } = req.user;
    const user = await Users_1.User.findById(userId).select("+password");
    if (!user)
        return res.status(404).json({ error: 'User not found.' });
    const deletedUser = await user.remove();
    if (!deletedUser)
        return res
            .status(403)
            .json({ error: "Error on deleting user. Try again later." });
    return res.json({ message: "User is successfully removed" });
}
exports.default = removeUser;
