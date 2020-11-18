const mailConfig = require('../config/mailConfig.js');
const hbs = require('nodemailer-express-handlebars');
const { resolve } = require('path');
const nodemailer = require('nodemailer');

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
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'email');

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

module.exports = new Mail();