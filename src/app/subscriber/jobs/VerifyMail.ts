import MailService from '../../services/MailService';
class VerifyMail {

  get key() {
    return 'VerifyMail';
  }

  async handle({ data }: { data: any}) {
    const { email, verifyToken, FRONT_URL } = data;

    await MailService.sendMail({
      to: email,
      from: 'TodoList <app.todolistraphael@gmail.com>',
      subject: 'Email confirmation',
      template: 'email_confirmation',
      context: { verifyToken, FRONT_URL },
    });
  }
}

export default new VerifyMail();
