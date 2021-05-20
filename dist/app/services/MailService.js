"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = require("../config/mail");
class Mail {
    constructor() {
        this.transporter = mail_1.transporter;
    }
    sendMail(message) {
        return this.transporter.sendMail(Object.assign({}, message));
    }
}
exports.default = new Mail();
