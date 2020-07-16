// 參考資料 : https://developers.google.com/youtube/v3/quickstart/nodejs
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

/*
* The YouTube Data API uses the following scopes:
*  Scopes
*  https://www.googleapis.com/auth/youtube	Manage your YouTube account
*  https://www.googleapis.com/auth/youtube.channel-memberships.creator	See a list of your current active channel members, their current level, and when they became a member
*  https://www.googleapis.com/auth/youtube.force-ssl	See, edit, and permanently delete your YouTube videos, ratings, comments and captions
*  https://www.googleapis.com/auth/youtube.readonly	View your YouTube account
*  https://www.googleapis.com/auth/youtube.upload	Manage your YouTube videos
*  https://www.googleapis.com/auth/youtubepartner	View and manage your assets and associated content on YouTube
*  https://www.googleapis.com/auth/youtubepartner-channel-audit	View private information of your YouTube channel relevant during the audit process with a YouTube partner
* */

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('../response/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(JSON.parse(content), getChannel);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var clientSecret = credentials.web.client_secret;
    var clientId = credentials.web.client_id;
    var redirectUrl = credentials.web.redirect_uris[0];
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    // https://accounts.google.com/signin/oauth/danger?authuser=0&part=AJi8hAOw3iC_jV9mrDVAzaizrQeKcdnP2ioR56t38TmOkN3K4R5n9f16M1dmD3wRp5w5DihMINEs04r2ty8AGL6hpln156U3RYpQPOHQXXNO_UbVffFpS48YSU1ElfxtC_8bdja3mJGfrr70IF_6PzvQWhbWUF9Lah8IjS7cxatY5dgVGatPJ8lW9dYzLr4zZtiEMUMptGPX2oPpunxCQ5VD-LeqJDtCAYPtu0cOCMx13EFXdJgS9CurmltR8ZPa_AXzhcqMIo1rCuTzEHF5mVhEL0yNMatqT4pXNHkJp7J1tPPEnyMXcSCNH-xJX6qpfoOZQ80p5fEr8bkg5xtAlItk1WYcuar-v70uPoIwlFuma-HNiFnlzE7KmkpD0es6-ui_jjF1cBEfmlImPREItcxQU1rSYBkvYRLx8MSxhLLdkdYNLxr-CIZwxLfKI7u_YSZd374wm5CZlARc-FwA3DS7zhSJbJD0RIcyHtwsvlHWbDeQUnv72eai4EOBWOYqkD_Ry24y4DMygOensnj6kp3V2rfyMOKhVn371gifklhN7lv8bMkLLDiFygjqgYnvhXstAqGzisAjUn6RFda2n03PNP-ykLH6yw&hl=zh-TW&as=lLEK3Fcf9XMqQkO8f3J1vA&rapt=AEjHL4Ph9H48CoSHFFjz341qoffAQ17zK1QqHmITE7YhdOUOwxRYbNBumMbJ2-KLjjzsmBT5VyDZopGhNJlkL2nb-T8rJiduyw#

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) throw err;
        console.log('Token stored to ' + TOKEN_PATH);
    });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
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
}