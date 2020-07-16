const {Router} = require('express');
const router = Router();
const getAuthenticatedClient = require('../modules/utils/authentication');
const CalendarApi = require('../modules/calendar/СalendarApi');

let calendarApi;

getAuthenticatedClient().then(auth => {
    calendarApi = new CalendarApi(auth = {auth});
});

router.get('/:calendarId', (req, res) => {
    try {
        calendarApi.listEvents(req.params.calendarId, req.query.start, req.query.end, req.query.count).then((events) => {
            res.json(events);
            console.log(events)
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
});

router.get('/', (req, res) => {
    try {
        res.json(calendarApi.listCalendars());
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;