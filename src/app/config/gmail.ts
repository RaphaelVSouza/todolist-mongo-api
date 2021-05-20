import { google } from 'googleapis'

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_MAIL_USER,
  GOOGLE_MAIL_PASS
} = process.env

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL
)

oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })

async function getGoogleAccessToken() {
  const { token } = await oAuth2Client.getAccessToken()

  return token
}

let accessToken: string
const refreshToken = GOOGLE_REFRESH_TOKEN

getGoogleAccessToken()
  .then((resolve) => (accessToken = resolve))
  .catch((error) => {
    error
  })

const gmailService = {
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: GOOGLE_MAIL_USER,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    refreshToken,
    accessToken,
    pass: GOOGLE_MAIL_PASS
  }
}

export default gmailService
