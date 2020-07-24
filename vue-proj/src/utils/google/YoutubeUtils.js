import fs from 'fs';
import axios from 'axios';

class YoutubeUtils {

    // 新增撥放清單
    async addPlayList({access_token, api_key}) {

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

        return {access_token, api_key, data: res.data, playlistId: res.data.id};
    }

    // 上傳影片 (youtube.video.insert)
    async addVideo({
                       googleApis,
                       channelId = 'UC8eCqbosTLZdvFCGid5YllA',
                       fileName,
                       title = `your-video-${new Date().getTime().toString(36).substring(0, 4)}`,
                       description = '測試上傳影片'
                   }) {

        const youtube = googleApis.youtube('v3'); // google.options 有設定 oauth2Client 之後會用那裏的驗證

        const fileSize = fs.statSync(fileName).size;
        const res = await youtube.videos.insert(
            {
                part: 'id,snippet,status,contentDetails',
                notifySubscribers: false,
                requestBody: {
                    snippet: {
                        channelId, // 上傳影片到哪個頻道
                        title,
                        description,
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
                    console.log(`${Math.round(progress)}% complete`);
                },
            }
        );

        return {googleApis, data: res.data, videoId: res.data.id};
    }

    // 設定影片到 撥放清單(playlist) 中
    async addVideoToPlayList({access_token, api_key, playlistId = 'PLW5vcWZJoRiYqPSg5ccZPJAPi1VDerImv', videoId}) {

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

        return {access_token, api_key, data: res.data};
    }

    // 取得我所有的撥放清單
    async getMyPlayList({access_token, api_key}) {

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

        return {access_token, api_key, data: res.data};
    }

    // 取得某撥放清單的內容
    async getPlayListById({access_token, api_key, playlistId = 'PLW5vcWZJoRiYqPSg5ccZPJAPi1VDerImv'}) {

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

        return {access_token, api_key, data: res.data};
    }

}

export default YoutubeUtils;