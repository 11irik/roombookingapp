const {google} = require('googleapis');

const CALENDAR_ID = '1t444hon0u15pi19irc51i81os@group.calendar.google.com';//todo
const MAX_EVENTS_COUNT = 10;

class CalendarApi {
    constructor(props) {
        let auth = props.auth;
        this.calendar = google.calendar({version: 'v3', auth});
    }

    async listEvents(startDate = (new Date()).toISOString(), endDate = (new Date()).toISOString(), maxResults = MAX_EVENTS_COUNT) {
        let events;

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        startDate.setHours(0,0,0,0);   //set min and max bound to get all events in chosen dates
        endDate.setHours(23,59,59,99);

        await this.calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: startDate,
            timeMax: endDate,
            maxResults: maxResults,
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