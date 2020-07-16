const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');

const {google} = require('googleapis');
const youtube = google.youtube('v3');

/**
 * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */
const keyPath = path.join(__dirname, '../response/oauth2.keys.json');
let keys = {redirect_uris: ['http://localhost:3000/oauth2callback']};
if (fs.existsSync(keyPath)) {
    keys = {...keys, ...require(keyPath).web};
}

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0]
);

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({auth: oauth2Client});

/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 */
async function authenticate(scopes) {
    return new Promise((resolve, reject) => {
        // grab the url that will be used for authorization
        const authorizeUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes.join(' '),
        });
        const server = http
            .createServer((req, res) => {
                if (req.url.indexOf('/oauth2callback') > -1) {
                    const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                    res.end('Authentication successful! Please return to the console.');
                    server.destroy();
                    oauth2Client.getToken(qs.get('code'))
                        .then(({tokens}) => {
                            console.log('token=', tokens);
                            oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
                            resolve(oauth2Client);
                        })
                        .catch(e => {
                            res.end('Authentication failed.');
                            reject(e);
                        });
                } else {
                    res.end('Wrong Url.');
                }
            })
            .listen(3000, () => {
                // open the browser to the authorize url to start the workflow
                opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
                console.log('access api at http://localhost:3000');
            });
        destroyer(server);
    });
}

/*
   curl -v -X GET https://api.sandbox.paypal.com/v1/invoicing/invoices?page=3&page_size=4&total_count_required=true \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer Access-Token"
 */

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {

    const {access_token} = auth.credentials;
    const YOUTUBE_TOKEN = require('../response/youtube-token.json');
    const axios = require('axios');
    axios.get('https://www.googleapis.com/youtube/v3/playlistItems',
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            params: {
                part: 'snippet,contentDetails',// 必填，把需要的資訊列出來
                playlistId: 'PLW5vcWZJoRiYqPSg5ccZPJAPi1VDerImv',// 播放清單的id
                maxResults: 50,// 預設為五筆資料，可以設定1~50
                key: YOUTUBE_TOKEN.TOKEN,
            }
        })
        .then(res => {
            console.log(res.data);
            fs.writeFileSync('../data/response-data.json', JSON.stringify(res.data));
        });
    /*
        var service = google.youtube('v3');
        service.channels.list({
            auth: auth,
            part: 'snippet,contentDetails,statistics',
            forUsername: 'GoogleDevelopers'
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            var channels = response.data.items;
            if (channels.length === 0) {
                console.log('No channel found.');
            } else {
                console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                    'it has %s views.',
                    channels[0].id,
                    channels[0].snippet.title,
                    channels[0].statistics.viewCount);
            }
        });

     */
}

const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
authenticate(scopes)
    .then(client => getChannel(client))
    .catch(console.error);
