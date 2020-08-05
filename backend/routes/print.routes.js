const {Router} = require('express');
const router = Router();
const Template = require('../modules/utils/Template')
const Printer = require('../modules/utils/Printer')
const fs = require('fs')
const DateParser = require('../modules/utils/DateParser')


router.post('/', (req, res) => {
    try {
        let data = req.body.location.split(' ')

        let obj = {
            id: data[0],
            date: DateParser.getDayString(new Date(req.body.end.dateTime)),
            description: req.body.description
        }

        fs.readFile('./check.txt', 'utf8', function(err, contents) {
            let text = Template.ApplyTemplate(contents, obj)
            Printer.print(text)
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
});

router.get('/test', (req, res) => {

});

module.exports = router;