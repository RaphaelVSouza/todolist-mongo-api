import { fileURLToPath } from 'url';
import hbs from 'nodemailer-express-handlebars';
import { resolve, dirname } from 'path';
import nodemailer from 'nodemailer';


import mailConfig from '../config/mailConfig.js';

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
    const viewPath = resolve(fileURLToPath(import.meta.url), '..', 'app', 'views', 'email');

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          layoutsDir: resolve(viewPath, 'layouts'),
          defaultLayout: 'default',
          partialsDir: resolve(viewPath, 'partials'),
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