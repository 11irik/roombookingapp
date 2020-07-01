const express = require('express');

const app = express();
app.use(express.json());

app.use('/api/calendar', require('./routes/calendar.routes'));

app.listen(5000, () => {
    console.log('server started on port 5000');
});


