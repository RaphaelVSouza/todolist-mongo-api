const { verify } = require('jsonwebtoken');
const Mail = require('../../lib/mail');



class VerifyEmail {
    get key() {
        return 'VerifyEmail';
    }

    async handle({ data }) {
        
        const { email, verifyToken, apiUrl } = data;

            await Mail.sendMail({
                to: email,
                from: 'random@company.com.br',
                subject: 'Email confirmation',
                template: 'email_confirmation',
                context: { verifyToken, apiUrl }
              })
    }
}
  

module.exports = new VerifyEmail();