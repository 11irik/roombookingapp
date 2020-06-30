const GoogleAuthClient = require('./GoogleAuthClient');
const fs = require('fs');
const util = require('util');
const readline = require('readline');
const readFile = util.promisify(fs.readFile);

const TOKEN_PATH = 'token.json';

async function getAuthenticatedClient()
{
    let authClient;

    await getData('credentials.json').then(data => {
        authClient = new GoogleAuthClient(JSON.parse(data));
    });

    try {
        await getData(TOKEN_PATH).then(data => {
            authClient.authorize(JSON.parse(data));
        });
    } catch (e) {
        await getToken(authClient);
    }

    return authClient.oAuth2Client
}

function getToken(authClient)
{
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log('Authorize this app by visiting this url:', authClient.getAuthUrl());
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();

        authClient.getAccessToken(code)
            .then(token => {
                authClient.authorize(token);

                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, token, (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
            });
    });
}

function getData(path) {
    return readFile(path);
}

module.exports = getAuthenticatedClient;