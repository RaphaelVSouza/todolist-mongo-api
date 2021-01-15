import Mail from '../../services/mail.js';

class VerifyMail {

  get key() {
    return 'VerifyMail';
  }

  async handle({ data }) {
    const { email, verifyToken, apiUrl } = data;

    await Mail.sendMail({
      to: email,
      from: 'random@company.com.br',
      subject: 'Email confirmation',
      template: 'email_confirmation',
      context: { verifyToken, apiUrl },
    });
  }
}

export default new VerifyMail();
