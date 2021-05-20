"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MailService_1 = __importDefault(require("../../services/MailService"));
class VerifyMail {
    get key() {
        return 'VerifyMail';
    }
    async handle({ data }) {
        const { email, verifyToken, FRONT_URL } = data;
        await MailService_1.default.sendMail({
            to: email,
            from: 'TodoList <app.todolistraphael@gmail.com>',
            subject: 'Email confirmation',
            template: 'email_confirmation',
            context: { verifyToken, FRONT_URL }
        });
    }
}
exports.default = new VerifyMail();
