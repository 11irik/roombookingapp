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
app.use('/api/print', require('./routes/print.routes'));


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

//TODO TOO MUCH RESPONSIBILITY
async function generateId(event) {
    fireBaseClient.doesEventExist(event.id).then(exists => {
        if (!exists) {
            const defaultStatus = "queue"

            try {
                if (!event.start.dateTime) {
                    setTime(event)
                }

                let eventDb = {
                    'calendarId': event.organizer.email,
                    'eventId': event.id,
                    'summary': event.summary,
                    'end': event.end.dateTime,
                    'status': defaultStatus,
                    'description': event.description
                };

                fireBaseClient.writeEvent(eventDb).then(id => {
                    let resource = {
                        'location': id + " " + defaultStatus,
                        'start': event.start,
                        'end': event.end
                    };

                    calendarApi.updateEvent(event.organizer.email, event.id, resource) //todo
                });
            } catch (e) {
                console.log(e);
            }
        }
    });

}

//todo add params
function setTime(event) {
    try {
        let start = new Date(event.start.date)
        let end = new Date(event.end.date)

        start.setHours(8, 0)
        end.setDate(end.getDate() - 1)
        end.setHours(20, 0)

        let resource = {
            'start': {
                dateTime: start,
                date: null
            },
            'end': {
                dateTime: end,
                date: null
            }
        };

        event.start = resource.start
        event.end = resource.end

        return event
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
}



