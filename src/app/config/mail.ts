import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import path from 'path';

import smtpConfig from './smtpConfig';

const { host, port, auth } = smtpConfig;

  const transporter = nodemailer.createTransport({
        host,
        port: +port || 0,
        secure: false,
        auth: {
          user: auth.user,
          pass: auth.pass,
        }

    });

    const viewPath = path.resolve(__dirname, '..', '..', '..', 'views', 'email');

    transporter.use(
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
      }),
    );



export { transporter }
