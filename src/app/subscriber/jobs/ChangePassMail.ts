import MailService from '../../services/MailService';
class ChangePasswordMail {
  get key () {
    return 'ChangePasswordMail'
  }

  async handle ({ data }: { data: any }) {
    const { email, resetToken, FRONT_URL } = data

    await MailService.sendMail({
      to: email,
      from: 'random@company.com.br',
      subject: 'Change password',
      template: 'forgot_password',
      context: { resetToken, FRONT_URL }
    })
  }
}

export default new ChangePasswordMail()
