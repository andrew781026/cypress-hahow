const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const axios = require('axios');
const readline = require('readline');

const {google} = require('googleapis');
const youtube = google.youtube('v3'); // google.options 有設定 oauth2Client 之後會用那裏的驗證

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

                    // Close the server
                    server.close(() => console.log('Server closed!'));

                    oauth2Client.getToken(qs.get('code'))
                        .then(({tokens}) => {
                            console.log('token=', tokens);
                            const YOUTUBE_TOKEN = require('../response/youtube-token.json');
                            oauth2Client.credentials = tokens;
                            resolve({access_token: tokens.access_token, api_key: YOUTUBE_TOKEN.API_KEY});
                        })
                        .catch(e => {
                            res.end('Authentication failed.');
                            reject(e);

                            // Close the server
                            server.close(() => console.log('Server closed!'));
                        });
                } else {
                    res.end('Wrong Url.You need to set http://localhost:3000/oauth2callback as redirect_uri');
                }
            })
            .listen(3000, () => {
                // open the browser to the authorize url to start the workflow
                opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
                console.log('access api at http://localhost:3000');
            });
    });
}

// 新增撥放清單
async function addPlayList({access_token, api_key}) {

    const nowStr = new Date().getTime().toString(36).substring(0, 4);
    const res = await axios.post('https://www.googleapis.com/youtube/v3/playlists',
        {
            snippet: {
                title: `add playlist - ${nowStr}`,
                description: "測試用新增撥放清單",
                // tags: [],
                // defaultLanguage: ''
            },
            status: {
                privacyStatus: "private"
            },
        },
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            params: {
                part: 'id,status,snippet,contentDetails',// 必填，把需要的資訊列出來
                key: api_key,
            }
        });

    fs.writeFileSync(`../data/add-playlist-${nowStr}.json`, JSON.stringify(res.data));

    return {access_token, api_key, data: res.data, playlistId: res.data.id};
}

// 上傳影片
async function addVideo({access_token, api_key, channelId = 'UC8eCqbosTLZdvFCGid5YllA', fileName = '../data/video.mp4'}) {

    // youtube.video.insert

    const nowStr = new Date().getTime().toString(36).substring(0, 4);

    const fileSize = fs.statSync(fileName).size;
    const res = await youtube.videos.insert(
        {
            part: 'id,snippet,status,contentDetails',
            notifySubscribers: false,
            requestBody: {
                snippet: {
                    channelId, // 上傳影片到哪個頻道
                    title: `your-video-${nowStr}`,
                    description: '測試上傳影片',
                },
                status: {
                    privacyStatus: "private"
                },
            },
            media: {
                body: fs.createReadStream(fileName),
            },
        },
        {
            // Use the `onUploadProgress` event from Axios to track the
            // number of bytes uploaded to this point.
            onUploadProgress: evt => {
                const progress = (evt.bytesRead / fileSize) * 100;
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0, null);
                process.stdout.write(`${Math.round(progress)}% complete\n`);
            },
        }
    );

    fs.writeFileSync(`../data/addVideo-${nowStr}.json`, JSON.stringify(res.data));

    return {access_token, api_key, data: res.data, videoId: res.data.id};
}

// 設定影片到 playlist 中
async function addVideoToPlayList({access_token, api_key, playlistId = 'PLW5vcWZJoRiYqPSg5ccZPJAPi1VDerImv', videoId}) {

    const res = await axios.post('https://www.googleapis.com/youtube/v3/playlistItems',
        {
            "snippet": {
                playlistId,
                "position": 0,
                "resourceId": {
                    "kind": "youtube#video",
                    videoId
                }
            }
        },
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            params: {
                part: 'contentDetails,id,snippet,status',// 必填，把需要的資訊列出來
                key: api_key,
            }
        });

    fs.writeFileSync(`../data/add-playlist-${playlistId}.json`, JSON.stringify(res.data));

    return {access_token, api_key, data: res.data};
}

// 取得我所有的撥放清單
async function getMyPlayList({access_token, api_key}) {

    const res = await axios.get('https://www.googleapis.com/youtube/v3/playlists',
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            params: {
                part: 'id,status,snippet,contentDetails,localizations,player',// 必填，把需要的資訊列出來
                mine: true,// 是否只顯示 OAuth2 用戶的撥放清單
                maxResults: 50,// 預設為五筆資料，可以設定1~50
                key: api_key,
            }
        });

    // TODO : 可能需要 iter 取取得所有的 playlist 資料
    fs.writeFileSync('../data/my-playlist.json', JSON.stringify(res.data));

    return {access_token, api_key, data: res.data};
}

// 取得某撥放清單的內容
async function getPlayListById({access_token, api_key, playlistId = 'PLW5vcWZJoRiYqPSg5ccZPJAPi1VDerImv'}) {

    const res = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems',
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            params: {
                part: 'snippet,contentDetails',// 必填，把需要的資訊列出來
                playlistId,// 播放清單的id
                maxResults: 50,// 預設為五筆資料，可以設定1~50
                key: api_key,
            }
        });

    // TODO : 可能需要 iter 所有的影片資訊
    fs.writeFileSync('../data/playlist-PLW5vcWZJoRiYqPSg5ccZPJAPi1VDerImv.json', JSON.stringify(res.data));

    return {access_token, api_key, data: res.data};
}

const scopes = [
    // 'https://www.googleapis.com/auth/youtube.readonly', // scope for get playlist . video ...etc.
    'https://www.googleapis.com/auth/youtube' // scope for add playlist
];
authenticate(scopes)
    // .then(addPlayList)
    .then(addVideo)
    .then(addVideoToPlayList)
    // .then(getMyPlayList)
    // .then(getPlayListById)
    .catch(console.error);
