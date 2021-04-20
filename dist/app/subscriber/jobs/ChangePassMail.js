"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MailService_1 = __importDefault(require("../../services/MailService"));
class ChangePasswordMail {
    get key() {
        return 'ChangePasswordMail';
    }
    async handle({ data }) {
        const { email, resetToken, FRONT_URL } = data;
        await MailService_1.default.sendMail({
            to: email,
            from: 'random@company.com.br',
            subject: 'Change password',
            template: 'forgot_password',
            context: { resetToken, FRONT_URL }
        });
    }
}
exports.default = new ChangePasswordMail();
