const admin = require('firebase-admin');
const serviceAccount = require('../../firebaseKey.json');
const makeid = require('./stringGenerator');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

//todo add collection name as props
const collectionName = 'identificators';
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

module.exports = {
    getEvent,
    writeEvent
};