import MailService from '../../services/MailService';

import path from 'path';

class VerifyMail {

  get key() {
    return 'VerifyMail';
  }

  async handle({ data }: { data: any}) {
    const { email, verifyToken, FRONT_URL } = data;
    const welcomeImg = path.resolve(__dirname, '..', '..', '..', '..', 'views', 'email', 'images', 'welcome.svg')

    await MailService.sendMail({
      to: email,
      from: 'random@company.com.br',
      subject: 'Email confirmation',
      template: 'email_confirmation',
      context: { verifyToken, FRONT_URL },
      attachments: [{
        filename: 'welcome.svg',
        path: welcomeImg,
        cid: 'welcome-image'
      }],
    });
  }
}

export default new VerifyMail();
