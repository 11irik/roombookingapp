const {Router} = require('express');
const router = Router();
const getAuthenticatedClient = require('../modules/utils/authentication');
const CalendarApi = require('../modules/calendar/СalendarApi');
const fireBaseClient = require('../modules/utils/firebaseClient');

let calendarApi;

getAuthenticatedClient().then(auth => {
    calendarApi = new CalendarApi(auth = {auth});
});

router.put('/', (req, res) => {
    try {
        let resource = {
            'start': req.body.start,
            'end': req.body.end
        };
        calendarApi.updateEvent(req.body.organizer.email, req.body.id, resource).then((status) => {

            res.json(status);
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
});

router.post('/finish', (req, res) => {
    try {
        let resource = {
            'start': req.body.start,
            'end': req.body.end
        };

        calendarApi.updateEvent(req.body.organizer.email, req.body.id, resource).then((status) => {
            fireBaseClient.finishEvent(req.body.location.split[0]);//todo also location now keep id and status(queue/progress)
            res.json(status);
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
});

//todo
router.post('/status', (req, res) => {
    try {
        let data = req.body.location.split(' ')

        let id = data[0]
        let status = data[1]

        if (status === "progress") {
            status = "queue"
        } else {
            status = "progress"
        }

        let resource = {
            'location': id + " " + status,
        };

        calendarApi.updateEvent(req.body.organizer.email, req.body.id, resource).then((status) => {
            res.json(status);
        })
        fireBaseClient.statusEvent(id);//todo also location now keep id and status(queue/progress)

    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
});


router.post('/generateId', (req, res) => {

    fireBaseClient.doesEventExist(req.body.id).then(exists => {
        if (!exists) {
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
        }
    });
});

router.get('/test', (req, res) => {
    try {
        fireBaseClient.doesEventExist('5ebpm0ropaoh2hka07qnnmh8r8');
        res.json('done')
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;