const express = require('express');
const cors = require('cors');
const fireBaseClient = require('./modules/utils/firebaseClient');
const getAuthenticatedClient = require('./modules/utils/authentication');
let calendarApi;

const CalendarApi = require('./modules/calendar/СalendarApi');

getAuthenticatedClient().then(auth => {
    calendarApi = new CalendarApi(auth = {auth});
});

const app = express();
const WEEK_LENGTH = 7;


app.use(express.json());
app.use(cors());

app.use('/api/calendar', require('./routes/calendar.routes'));
app.use('/api/event', require('./routes/event.routes'));


const path = require('path');
const port = process.env.PORT || 8080;

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let requestLoop = setInterval(function () {
    let now = new Date();
    let weekAgoDate = new Date(now);
    let twoWeekForwardDate = new Date(now);
    weekAgoDate.setDate(weekAgoDate.getDate() - WEEK_LENGTH);
    twoWeekForwardDate.setDate(twoWeekForwardDate.getDate() + 2 * WEEK_LENGTH);

    calendarApi.listCalendars().forEach(calendar => {
        calendarApi.listEvents(calendar.id, weekAgoDate, twoWeekForwardDate).then((events) => {
            events.forEach(event => {
                if (!event.location) {
                    generateId(event)
                }
            })
        })
    });
}, 15000);//todo timer length

app.listen(5000, () => {
    console.log('server started on port 5000');
});

function generateId(event) {
    fireBaseClient.doesEventExist(event.id).then(exists => {
        if (!exists) {
            try {
                let eventDb = {
                    'calendarId': event.organizer.email,
                    'eventId': event.id,
                    'summary': event.summary,
                    'end': event.end.dateTime,
                    'status': false,
                };

                fireBaseClient.writeEvent(eventDb).then(id => {
                    let resource = {
                        "location": id
                    };

                    calendarApi.updateEvent(event.organizer.email, event.id, resource) //todo
                });
            } catch (e) {
                console.log(e);
            }
        }
    });

}

