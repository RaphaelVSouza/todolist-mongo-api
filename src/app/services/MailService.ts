import { transporter } from '../config/mail'
import { IMail } from '../interfaces/mail'

import smtpConfig from '../config/smtpConfig'

class Mail {
  private transporter

  constructor() {
    this.transporter = transporter
  }

  sendMail(message: IMail) {
    return this.transporter.sendMail({ ...message })
  }
}

export default new Mail()
