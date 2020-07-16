const express = require('express');
const cors = require('cors');

const app = express();


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

app.listen(5000, () => {
    console.log('server started on port 5000');
});


