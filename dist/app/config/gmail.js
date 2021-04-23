"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL, GOOGLE_REFRESH_TOKEN, MAIL_USER, MAIL_PASS } = process.env;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
async function getGoogleAccessToken() {
    const { token } = await oAuth2Client.getAccessToken();
    return token;
}
const gmailService = {
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: MAIL_USER,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken: getGoogleAccessToken(),
        pass: MAIL_PASS
    },
};
exports.default = gmailService;
