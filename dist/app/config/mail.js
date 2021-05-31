"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const smtpConfig_1 = __importDefault(require("./smtpConfig"));
const gmail_1 = __importDefault(require("./gmail"));
const currentMailService = process.env.MAIL_SERVICE === 'gmail'
    ? gmail_1.default
    : smtpConfig_1.default;
const transporter = nodemailer_1.default.createTransport(currentMailService);
exports.transporter = transporter;
const viewPath = path_1.default.resolve(__dirname, '..', '..', '..', 'views', 'email');
transporter.use('compile', nodemailer_express_handlebars_1.default({
    viewEngine: {
        layoutsDir: path_1.default.resolve(viewPath, 'layouts'),
        defaultLayout: 'default',
        partialsDir: path_1.default.resolve(viewPath, 'partials'),
        extname: '.hbs'
    },
    viewPath,
    extName: '.hbs'
}));
