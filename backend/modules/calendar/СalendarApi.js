const {google} = require('googleapis');

//todo move to prop file
const calendars =
    [
        {
            id: '1t444hon0u15pi19irc51i81os@group.calendar.google.com',
            name: 'Человек 1',
            link: 'https://calendar.google.com/calendar?cid=MXQ0NDRob24wdTE1cGkxOWlyYzUxaTgxb3NAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ'
        },

        {
            id: 'fhhe3104bmbm3ugbs719p5ofpk@group.calendar.google.com',
            name: 'Человек 2',
            link: 'https://calendar.google.com/calendar?cid=ZmhoZTMxMDRibWJtM3VnYnM3MTlwNW9mcGtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ'
        }
    ];

const MAX_EVENTS_COUNT = 10;

class CalendarApi {
    constructor(props) {
        let auth = props.auth;
        this.calendar = google.calendar({version: 'v3', auth});
    }

    async listEvents(calendarId, startDate = (new Date()).toISOString(), endDate = (new Date(startDate)).toISOString(), maxResults = MAX_EVENTS_COUNT) {
        let events = [];

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        startDate.setHours(0, 0, 0, 0);   //set min and max bound to get all events in chosen dates
        endDate.setHours(23, 59, 59, 99);
        
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
        return calendars;
    }
}

module.exports = CalendarApi;