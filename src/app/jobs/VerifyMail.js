import Mail from '../../lib/mail.js';

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


export default new VerifyEmail();
