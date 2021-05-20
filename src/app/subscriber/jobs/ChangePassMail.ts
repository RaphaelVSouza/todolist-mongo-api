import MailService from '../../services/MailService'
class ChangePasswordMail {
  get key() {
    return 'ChangePasswordMail'
  }

  async handle({ data }: { data: any }) {
    const { email, resetToken, FRONT_URL } = data

    await MailService.sendMail({
      to: email,
      from: 'TodoList <app.todolistraphael@gmail.com>',
      subject: 'Change password',
      template: 'forgot_password',
      context: { resetToken, FRONT_URL }
    })
  }
}

export default new ChangePasswordMail()
