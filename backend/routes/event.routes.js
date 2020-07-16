const {Router} = require('express');
const router = Router();
const getAuthenticatedClient = require('../modules/utils/authentication');
const CalendarApi = require('../modules/calendar/СalendarApi');

let calendarApi;

getAuthenticatedClient().then(auth => {
    calendarApi = new CalendarApi(auth = {auth});
});

router.put('/', (req, res) => {
    try {
        calendarApi.updateEvent(req.body.calendarId, req.body.eventId, req.body.resource).then((status) => {
            res.json(status);
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
});


//fixme add check for event existence in db
const fireBaseClient = require('../modules/utils/firebaseClient');
router.post('/generateId', (req, res) => {
    try {
        let event = {
            'calendarId': req.body.organizer.email,
            'eventId': req.body.id,
            'summary': req.body.summary
        };

        fireBaseClient.writeEvent(event).then(id => {
            let resource = {
                "location": id
            };

            calendarApi.updateEvent(req.body.organizer.email, req.body.id, resource) //todo
        });



    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
});

router.get('/a', (req, res) => {
    try {
        fireBaseClient.getEvent();
        res.json('done')
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;