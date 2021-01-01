import Mail from '../../lib/mail.js';

class ChangePasswordMail {
  get key() {
    return 'ChangePasswordMail';
  }

  async handle({ data }) {
    const { email, resetToken, apiUrl } = data;

    await Mail.sendMail({
      to: email,
      from: 'random@company.com.br',
      subject: 'Change password',
      template: 'forgot_password',
      context: { resetToken, apiUrl },
    });
  }
}

export default new ChangePasswordMail();
