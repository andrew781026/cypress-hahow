import {ipcMain} from "electron";
import {HttpUtil} from '../utils/httpUtil';
import fs from 'fs';
import path from 'path';
import low from 'lowdb'; // json db
import FileSync from 'lowdb/adapters/FileSync';

let db;

const createFileIfNotExist = targetPath => {

    if (fs.existsSync(targetPath)) return 'file db.json already exist';
    else {

        if (!fs.existsSync(path.resolve(targetPath, '..'))) {
            fs.mkdirSync(path.resolve(targetPath, '..'), {recursive: true});
        }

        fs.writeFileSync(targetPath, '');
        return 'success create file db.json';
    }
};

createFileIfNotExist(path.resolve(__dirname, '../data/db.json'));

ipcMain.handle('connect-to-json-db', async (event, args) => {

    const adapter = new FileSync(path.resolve(__dirname, '../data/db.json'));
    db = low(adapter);

    // Set some defaults (required if your JSON file is empty)
    db.defaults({youtubeToken: '', hahowToken: '', courses: []}).write();

    return 'connect done !';
});

ipcMain.handle('get-json-db-all-info', (event, args) => {

    return db.getState(); // { youtubeToken: '', hahowToken: '', courses: [] }
});

// .handle method can return result to ipcRenderer.invoke
ipcMain.handle('save-youtubeToken', async (apiKey) => {

    // Increment count
    db.update('youtubeToken', apiKey).write();

    return 'you save youtube success';
});

// .handle method can return result to ipcRenderer.invoke
ipcMain.handle('save-hahowToken', async (event, apiKey) => {

    db.set('hahowToken', apiKey).write();

    return 'you save hahow success';
});

// 顯示上次下載的進度 ,
ipcMain.handle('get-pre-download-progress', async () => {

    // 直接查看下載資訊的檔案 , 確認此課程有多少沒下載 , 有多少已下載

    // TODO 以下事項
    // 1. 用 db.json 查出 目前最新的 A 課程相關資訊的 json 檔存哪裡
    // 2. 查看課程並撥放之
    // 3. 上傳檔案到 youtube 並形成系列影集並 4.上字幕
});

// 取得個人購買的所有課程
ipcMain.handle('get-personal-courses', async () => {

    const getBoughtCourses = async ({token}) => {

        const itemUrl = 'https://api.hahow.in/api/users/me/boughtCourses';
        return await HttpUtil.get({url: itemUrl, token});
    };

    const token = db.get('hahowToken').value();
    const courses = await getBoughtCourses({token});
    db.set('courses',courses).write();


    /*
      the response of courses data :
       {
            "creationsProgress": 0,
            "lecturesVideoProgress": 0.034482758620689655, // 課程完成度
            "certificateAcquired": false, // 是否完成課程
            "status": "PUBLISHED", // 課程狀態
            "averageRating": 4.98, // 平均星數
            "numRating": 333, // 總星數
            "_id": "56189df9df7b3d0b005c6639",
            "assignment": "56189df9df7b3d0b005c663a",
            "owner": {
            "_id": "56189df7df7b3d0b005c6638",
            "profileImageUrl": "https://hahow.in/images/59940a4d38c46c0700654afc", // 講師頭像
            "name": "吳哲宇", // 講師名稱
            "username": "majer"
            },
            "title": "動畫互動網頁程式入門 (HTML/CSS/JS)",
            "metaDescription": "互動網頁程式設計課程，教你用 illustrator 的思維來學習網頁前端程式設計，從網站的結構開始設計，掌握 JS、HTML、CSS 等程式語法，帶你製作出實用且美觀的互動式網頁。",
            "coverImage": {
            "_id": "5b8726df297df5001efb75c0",
            "url": "https://images.api.hahow.in/images/5b8726df297df5001efb75c0" // 課程圖片
            },
            "totalVideoLengthInSeconds": 104721, // 課程時長
        },

     */


    return courses;
});

// the class info will save to local json
ipcMain.handle('get-course-detail-info', async () => {

    // 2. 用 videoProgress 取得課程相關 ID ( ex : lecture_id )
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
            imageUrl: data.video.previewImageUrls.VIMEO.DIMENSION_W1000,
            videoUrl: data.video.videos.find(item => item.quality === 'sd' && item.width === 960).link,
            title: data.title
        };
    };

});


// 下載任務暫停與繼續下載 => 斷點續傳 : https://segmentfault.com/q/1010000019524002
