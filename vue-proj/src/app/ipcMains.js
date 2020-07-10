import {ipcMain} from "electron";
import HahowUtils from '../utils/hahowUtils';
import {createFileIfNotExist} from '../utils/ezoomUtils';
import path from 'path';
import low from 'lowdb'; // json db
import FileSync from 'lowdb/adapters/FileSync';

let db;

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

    const token = db.get('hahowToken').value();
    if (!token) throw new Error('hahow token not exist error');
    else {

        const courses = await HahowUtils.getBoughtCourses({token});
        db.set('courses', courses).write();

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
    }
});

// the class info will save to local json
ipcMain.handle('get-course-videos', async (event, course_id) => {

    const token = db.get('hahowToken').value();

    const lectureIds = await HahowUtils.getLectureIdsByCourseId({course_id, token});

    const videoInfos = await Promise.all(lectureIds.map(lectureId => HahowUtils.getLectureInfo({lectureId, token})));

    createFileIfNotExist(path.resolve(__dirname, `../data/course_${course_id}-videoInfos.json`));
    const adapter = new FileSync(path.resolve(__dirname, `../data/course_${course_id}-videoInfos.json`));
    const database = low(adapter);
    database.setState(videoInfos).write();
    return videoInfos;
});


// 下載任務暫停與繼續下載 => 斷點續傳 : https://segmentfault.com/q/1010000019524002
