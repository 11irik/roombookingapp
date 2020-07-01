const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

class GoogleAuthClient {
    constructor(props) {
        this.oAuth2Client = new google.auth.OAuth2(
            props.web.client_id,
            props.web.client_secret,
            props.web.redirect_uris[0],
        );
    }

    async authorize(token) {
        await this.oAuth2Client.setCredentials(token);
    }

    async getAccessToken(code) {
        let k;
        await this.oAuth2Client.getToken(code).then(r => {
            k = JSON.stringify(r.tokens);
        });
        return k;

    }

    getAuthUrl() {
        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
    }
}

module.exports = GoogleAuthClient;