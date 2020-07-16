// 參考資料 : https://developers.google.com/youtube/v3/quickstart/nodejs
// https://medium.com/%E5%B0%8F%E9%83%AD-%E0%B9%80%E0%B8%88%E0%B8%99/%E8%8F%9C%E9%B3%A5%E5%B7%A5%E7%A8%8B%E5%B8%AB-youtube-data-api-%E8%BC%89%E5%85%A5%E6%92%AD%E6%94%BE%E6%B8%85%E5%96%AE%E4%B8%A6%E5%88%87%E6%8F%9B%E6%AD%8C%E6%9B%B2-356d8e454ca3
const axios = require('axios');
const YOUTUBE_TOKEN = require('../response/youtube-token.json');

/*
curl \
  'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=PLW5vcWZJoRiYqPSg5ccZPJAPi1VDerImv&key=[YOUR_API_KEY]' \
  --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
  --header 'Accept: application/json' \
  --compressed
*/

// a very simple example of searching for youtube videos
// 私人的撥放清單 , 需要用 OAuth 登入後才能取得
async function runSample() {

    // create playlist
    const res = await axios.post('https://www.googleapis.com/youtube/v3/playlists',
        {
            snippet: {
                title: '',
                description: '',
                // tags: [],
                // defaultLanguage: ''
            },
            status: {
                privacyStatus: "private"
            },
        },
        {
            headers: {
                Authorization: `Bearer ${YOUTUBE_TOKEN.ACCESS_TOKEN}`
            },
            params: {
                part: 'id,snippet,contentDetails',// 必填，把需要的資訊列出來
                playlistId: 'PLnPLskqK8ToDKWUBK_IoXOXe8RkV2qaXm',// 播放清單的id
                maxResults: 50,// 預設為五筆資料，可以設定1~50
                key: YOUTUBE_TOKEN.API_KEY, // 使用 API 只能取得公開的播放清單
                managedByMe: true,
            }
        });

    console.log(res.data);
}

runSample().catch(err => console.error(err));