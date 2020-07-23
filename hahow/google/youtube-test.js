// 參考資料 : https://developers.google.com/youtube/v3/quickstart/nodejs
// https://medium.com/%E5%B0%8F%E9%83%AD-%E0%B9%80%E0%B8%88%E0%B8%99/%E8%8F%9C%E9%B3%A5%E5%B7%A5%E7%A8%8B%E5%B8%AB-youtube-data-api-%E8%BC%89%E5%85%A5%E6%92%AD%E6%94%BE%E6%B8%85%E5%96%AE%E4%B8%A6%E5%88%87%E6%8F%9B%E6%AD%8C%E6%9B%B2-356d8e454ca3
const axios = require('axios');
const API_KEY = 'AIzaSyCfTvOCJ5JA5eTeetkHSfDBUurdJeBDm94';

// a very simple example of searching for youtube videos
// 私人的撥放清單 , 需要用 OAuth 登入後才能取得
async function runSample() {

    // create playlist
    const res = await axios.get('https://www.googleapis.com/youtube/v3/search',
        {
            params: {
                part: 'id,snippet',// 必填，把需要的資訊列出來
                q: '韓國瑜',// 查詢文字
                maxResults: 50,// 預設為五筆資料，可以設定1~50
                key: API_KEY, // 使用 API 只能取得公開的播放清單
            }
        });

    console.log(res.data);
}

runSample().catch(err => console.error(err));