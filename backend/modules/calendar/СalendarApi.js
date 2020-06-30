const {google} = require('googleapis');

const CALENDAR_ID = '1t444hon0u15pi19irc51i81os@group.calendar.google.com';

class CalendarApi {
    constructor(props) {
        let auth = props.auth;
        this.calendar = google.calendar({version: 'v3', auth});
    }

    //todo
    async listEvents() {
        let events;

        await this.calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }).then(
            res => events = res.data.items,
            err => console.log(err),
        );

        return events;
    }
}

module.exports = CalendarApi;