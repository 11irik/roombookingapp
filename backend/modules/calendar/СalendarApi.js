const {google} = require('googleapis');
const fs = require('fs');

const CALENDARS_PATH = 'calendars.json';

const CALENDARS = JSON.parse(fs.readFileSync(CALENDARS_PATH));

const MAX_EVENTS_COUNT = 50;

class CalendarApi {
    constructor(props) {
        let auth = props.auth;
        this.calendar = google.calendar({version: 'v3', auth});
    }

    async listEvents(calendarId, startDate = (new Date()).toISOString(), endDate = (new Date(startDate)).toISOString(), maxResults = MAX_EVENTS_COUNT) {
        let events = [];
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        await this.calendar.events.list({
            calendarId: calendarId,
            timeMin: startDate,
            timeMax: endDate,
            maxResults: maxResults,
            singleEvents: true,
            orderBy: 'startTime',
        }).then(
            res => events = events.concat(res.data.items),
            err => console.log(err),
        );

        return events;
    }

    listCalendars() {
        return CALENDARS;
    }

    async updateEvent(calendarId, eventId, resource) {
        let x = "error";

        let calendarObject =
            {
                'calendarId': calendarId,
                'eventId': eventId,
                'resource': resource
            };

        await this.calendar.events.patch(calendarObject).then(
            res => x = res,
            err => console.log(err),
        );

        return x;
    }
}

module.exports = CalendarApi;