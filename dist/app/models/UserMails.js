"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMail = void 0;
const mongoose_1 = require("mongoose");
const UserMailSchema = new mongoose_1.Schema({
    verifyEmailToken: {
        type: String,
        required: true,
    },
    verifyEmailExpires: {
        type: Date,
        required: true,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
const UserMail = mongoose_1.model('UserMail', UserMailSchema);
exports.UserMail = UserMail;
