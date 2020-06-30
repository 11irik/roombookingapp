const {google} = require('googleapis');

const CALENDAR_ID = '1t444hon0u15pi19irc51i81os@group.calendar.google.com';

class CalendarApi {
    constructor(props) {
        let auth = props.auth;
        this.calendar = google.calendar({version: 'v3', auth});
    }

    listEvents() {
        this.calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const events = res.data.items;
            if (events.length) {
                console.log('Upcoming 10 events:');
                console.log(events);
                events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;
                    console.log(`${start} - ${event.summary}`);
                });
            } else {
                console.log('No upcoming events found.');
            }
        });
    }
}

module.exports = CalendarApi;