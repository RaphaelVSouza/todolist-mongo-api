import hbs from 'nodemailer-express-handlebars';

import nodemailer from 'nodemailer';

import { fileURLToPath } from 'url';
import path from 'path';

//const __dirname = path.dirname(fileURLToPath(import.meta.url));

import mailConfig from '../config/mail.js';

const { host, port, auth } = mailConfig;

class Mail {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = path.resolve(__dirname, '..', 'app', 'views', 'email');

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          layoutsDir: path.resolve(viewPath, 'layouts'),
          defaultLayout: 'default',
          partialsDir: path.resolve(viewPath, 'partials'),
          extname: '.hbs',
        },
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({ ...mailConfig.default, ...message });
  }
}

export default new Mail();
