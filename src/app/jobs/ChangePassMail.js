import Mail from '../../services/mail.js';

class ChangePasswordMail {
  get key() {
    return 'ChangePasswordMail';
  }

  async handle({ data }) {
    const { email, resetToken, frontUrl } = data;

    await Mail.sendMail({
      to: email,
      from: 'random@company.com.br',
      subject: 'Change password',
      template: 'forgot_password',
      context: { resetToken, frontUrl },
    });
  }
}

export default new ChangePasswordMail();
