"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MailService_1 = __importDefault(require("../../services/MailService"));
const path_1 = __importDefault(require("path"));
class VerifyMail {
    get key() {
        return 'VerifyMail';
    }
    async handle({ data }) {
        const { email, verifyToken, API_URL } = data;
        const welcomeImg = path_1.default.resolve(__dirname, '..', '..', '..', '..', 'views', 'email', 'images', 'welcome.svg');
        await MailService_1.default.sendMail({
            to: email,
            from: 'random@company.com.br',
            subject: 'Email confirmation',
            template: 'email_confirmation',
            context: { verifyToken, API_URL },
            attachments: [{
                    filename: 'welcome.svg',
                    path: welcomeImg,
                    cid: 'welcome-image'
                }],
        });
    }
}
exports.default = new VerifyMail();
