"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = require("../config/mail");
const smtpConfig_1 = __importDefault(require("../config/smtpConfig"));
class Mail {
    constructor() {
        this.transporter = mail_1.transporter;
    }
    sendMail(message) {
        return this.transporter.sendMail(Object.assign(Object.assign({}, smtpConfig_1.default), message));
    }
}
exports.default = new Mail();
