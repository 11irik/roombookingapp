const admin = require('firebase-admin');
const serviceAccount = require('../../firebaseKey.json');
const makeid = require('./stringGenerator');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

//todo add collection name as props
const collectionName = 'identifiers';
const idLength = 6;

function getEvent(id) {
    db.collection(collectionName).doc(id)
        .get()
        .then(function (doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

//todo probably kostil (remove async and fst return)
async function doesEventExist(eventId) {
    return db.collection(collectionName)
        .where('eventId', '==', eventId).get()
        .then(doc => {
            return doc.size
        });
}

async function writeEvent(event) {
    let id = makeid(idLength);
    let document = await db.collection(collectionName).doc(id);

    //TODO FUCKING KOSTIL
    return document.get()
        .then(doc => {
            if (doc.exists) {
                writeEvent(event);
            } else {
                document.set(event)
                    .then(() => {
                        console.log('Short id generated: ' + id);
                    });
                return id;
            }
        });
        // .catch(function (error) {
        //     console.log("Error getting document:", error);
        // });
}

//todo
async function finishEvent(id) {

    let document = await db.collection(collectionName).doc(id);

    return document.get()
        .then(doc => {
            if (doc.exists) {
                document.update({status: true, finalEnd: new Date().toISOString()})
            } else {
                console.log('There is no such document: ' + id);
                return id;
            }
        });
    // .catch(function (error) {
    //     console.log("Error getting document:", error);
    // });
}

async function generateId(event) {
    this.doesEventExist(event.id).then(exists => {
        if (!exists) {
            try {
                let event = {
                    'calendarId': event.organizer.email,
                    'eventId': event.id,
                    'summary': event.summary
                };

                this.writeEvent(event).then(id => {
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
}

module.exports = {
    getEvent,
    doesEventExist,
    writeEvent,
    finishEvent
};