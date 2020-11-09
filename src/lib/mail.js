const mailConfig = require('../config/mailConfig.js');
const hbs = require('nodemailer-express-handlebars');
const path = require('path')
const nodemailer = require('nodemailer')

var transport = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    auth: mailConfig.auth
  });

  transport.use('compile', hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve('./src/resources/mail/')
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  }));
  
  module.exports = transport;
