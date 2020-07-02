const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/calendar', require('./routes/calendar.routes'));

app.listen(5000, () => {
    console.log('server started on port 5000');
});


