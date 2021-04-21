"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const queue_1 = __importDefault(require("../subscriber/queue"));
const VerifyMail_1 = __importDefault(require("../subscriber/jobs/VerifyMail"));
const UserMails_1 = require("../models/UserMails");
class MailService {
    static async sendConfirmationMail(id, email) {
        const verifyToken = crypto_1.default.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);
        await UserMails_1.UserMail.updateOne({ user_id: id }, {
            verifyEmailToken: verifyToken,
            verifyEmailExpires: now,
            user_id: id
        }, { upsert: true });
        if (process.env.NODE_ENV === 'production') {
            const { FRONT_URL } = process.env;
            await queue_1.default.add(VerifyMail_1.default.key, { email, FRONT_URL, verifyToken });
        }
        return { verifyToken };
    }
}
exports.default = MailService;
