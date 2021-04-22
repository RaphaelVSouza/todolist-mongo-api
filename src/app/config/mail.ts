import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import path from 'path';

import defaultMailService from './smtpConfig';
import googleMailService from './gmail';

const currentMailService = process.env.MAIL_SERVICE === 'gmail' ? googleMailService : defaultMailService as any;

  const transporter = nodemailer.createTransport(currentMailService);

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
