const {Router} = require('express');
const router = Router();
const getAuthenticatedClient = require('../modules/utils/authentication');
const CalendarApi = require('../modules/calendar/СalendarApi');

let calendarApi;

getAuthenticatedClient().then(auth => {
    calendarApi = new CalendarApi(auth = {auth});
});

router.get('/', async (req, res) => {
    try {
        calendarApi.listEvents();
        res.send('ok');
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;