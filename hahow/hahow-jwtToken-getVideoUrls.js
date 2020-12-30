// 1. 取得 jwtToken

// 2. 用 videoProgress 取得課程相關 ID ( ex : lecture_id )

const fs = require('fs');
const download = require('download');
const moment = require('moment');
const {promiseAll, stringHook, mapReplace, deleteFolderRecursive} = require('../utils/tool');
const {HttpUtil} = require('../utils/http');

/* the videoProgressUrl response like below
    ASSIGNMENT 是作業 / LECTURE 是課程
[
   {
       "_id": "5c91835ced65c200740ef386",
       "title": "課程介紹與導讀",
       "items": [
            {
               "type": "LECTURE",
               "_id": "5a1e1755a2c4b000589dda06",
               "content": {
                  "_id": "59131bf62fa2a607008bc8e6",
                  "moduleItem": "5a1e1755a2c4b000589dda06",
                  ...
               }
            },
            ...
            {
               "type": "ASSIGNMENT",
               "_id": "5a1e1755a2c4b000589dda53",
               "content": {
                  "_id": "586fae97a8aae907000ce722",
                  "moduleItem": "5a1e1755a2c4b000589dda53",
                  ...
               }
            },
        ]
    },
...]
*/
const getLectureIds = async ({classId, token}) => {

    const itemUrl = `https://api.hahow.in/api/courses/${classId}/modules/items`;
    const data = await HttpUtil.get({url: itemUrl, token});

    return data
        .reduce((pre, curr) => [...pre, ...curr.items], [])
        .filter(single => single.type === 'LECTURE' && single.content.video.isExisted) // 是 LECTURE 類型且 有 video
        .map(single => single.content._id);
};

// 3. 用 lecture_id 取得課程某章節資訊 ( 章節說明文字 . 影片網址 ...等 )

/* the lectureInfoUrl response like below
{
  "migratedToWistia": true,
  "_id": "591d0f1f00f58c070078944e",
  "updatedAt": "2019-03-20T12:12:56.180Z",
  ...
  "course": "586fae97a8aae907000ce721",
  "moduleItem": "5a1e1755a2c4b000589dda07",
  "title": "課程路線與學習方式",
  "description": ...,
  "video": {
    "_id": "59943f0e4521fa0700e72ceb",
    "previewImageUrls": {
      "HAHOW": {
        "DIMENSION_W300": "https://images.api.hahow.in/images/599404c538c46c0700654a9f?width=300",
      },
    },
    "wistiaHashedId": "6qhblzmwj9",
    "videos": [
      ...
      {
        "quality": "sd",
        "width": 960,
        "height": 540,
        "size": 19651576,
        "link": "https://player.vimeo.com/play/811034616?s=229820954_1590418455_534713971a5f6889de168eb6d60d3f8e",
        "expires": "2020-05-25T05:54:15.000Z"
      },
      ...
    ],
    ...
  }
}
*/
const getLectureInfo = async ({lectureId, token}) => {

    const lectureInfoUrl = `https://api.hahow.in/api/lectures/${lectureId}`;
    const data = await HttpUtil.get({url: lectureInfoUrl, token});

    return {
        imageUrl: data.video.previewImageUrls.VIMEO?.DIMENSION_W1000,
        videoUrl: data.video.videos.find(item => item.quality === 'sd' && item.width === 960).link,
        title: data.title
    };
};

// 4. 將抓出的資料存到檔案中
const saveVideoInfo = async ({clazz, arr}) => {

    // Escape it with square braces []
    const path = `./videos-${clazz.id}-${moment().format('YYYY-MM-DD_HH[h]mm[m]ss[s]')}.json`;
    fs.writeFileSync(path, JSON.stringify(arr));

    return arr;
};

// 5. 將影片檔案下載並儲存
const saveVideoFromUrl = async ({url, dest}) => {

    deleteFolderRecursive(dest);

    await download(url, dest);
};

// 產生一個 async function 並立即執行他
(async () => {

    stringHook('mapReplace', mapReplace);
    const {token} = require('./response/passport');
    const clazz = {
        // 課程 ID
        id: '586fae97a8aae907000ce721',
        // 課程名稱
        name: "動畫互動網頁特效入門（JS/CANVAS）",
        // 老師名稱
        author: "吳哲宇",
    };

    // 取得章節 ID
    const lectureIds = await getLectureIds({classId: clazz.id, token});

    const promiseIterator = lectureIds.map(lectureId => getLectureInfo({lectureId, token}));

    const lectureInfoArray = await promiseAll(promiseIterator, 5);

    await saveVideoInfo({arr: lectureInfoArray, clazz});

    const item = lectureInfoArray[0];
    saveVideoFromUrl({url: item.videoUrl, dest: `./video/${item.title}`})
        .then(
            // onFulfilled
            () => {

                console.log('success download !!');

            },
            // onRejected
            (err) => console.error(err)
        );

    // we need to download mp4 to target folder
})();

// push the mp4 to personal private channel in youtube

// make it become electron App

// 下載中

// 上傳中

// 管理帳號 . 頻道管理
