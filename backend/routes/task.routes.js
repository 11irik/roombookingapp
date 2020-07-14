const {Router} = require('express');
const router = Router();



router.get('/:calendarId', (req, res) => {
    try {
        res.send('<!DOCTYPE html>\n' +
            '<html lang="en">\n' +
            '  <head>\n' +
            '    <meta charset="utf-8" />\n' +
            '    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />\n' +
            '    <meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
            '    <meta name="theme-color" content="#000000" />\n' +
            '    <meta\n' +
            '      name="description"\n' +
            '      content="Web site created using create-react-app"\n' +
            '    />\n' +
            '    <!--\n' +
            '      user\'s mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/\n' +
            '    -->\n' +
            '    <!--\n' +
            '      Notice the use of %PUBLIC_URL% in the tags above.\n' +
            '      It will be replaced with the URL of the `public` folder during the build.\n' +
            '      Only files inside the `public` folder can be referenced from the HTML.\n' +
            '\n' +
            '      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will\n' +
            '      work correctly both with client-side routing and a non-root public URL.\n' +
            '      Learn how to configure a non-root public URL by running `npm run build`.\n' +
            '    -->\n' +
            '    <title>Мастерская</title>\n' +
            '  </head>\n' +
            '  <body>\n' +
            '    <noscript>You need to enable JavaScript to run this app.</noscript>\n' +
            '    <container id="root"></container>\n' +
            '    <!--\n' +
            '      This HTML file is a template.\n' +
            '      If you open it directly in the browser, you will see an empty page.\n' +
            '\n' +
            '      You can add webfonts, meta tags, or analytics to this file.\n' +
            '      The build step will place the bundled scripts into the <body> tag.\n' +
            '\n' +
            '      To begin the development, run `npm start` or `yarn start`.\n' +
            '      To create a production bundle, use `npm run build` or `yarn build`.\n' +
            '    -->\n' +
            '  </body>\n' +
            '</html>\n');
        // calendarApi.listEvents(req.params.calendarId, req.query.start, req.query.end, req.query.count).then((events) => {
        //     res.json(events);
        // })
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
});

// router.get('/', (req, res) => {
//     try {
//         res.json(calendarApi.listCalendars());
//     } catch (e) {
//         console.log(e);
//         res.status(500).json({message: 'Server error'});
//     }
// });

module.exports = router;