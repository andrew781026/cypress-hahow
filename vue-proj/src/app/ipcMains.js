import {BrowserWindow, ipcMain, shell} from "electron";
import HahowUtils from '../utils/hahowUtils';
import DbUtils from '../utils/dbUtils';
import GoogleOAuth2Util from '../utils/google/GoogleOAuth2Util';
import YoutubeUtils from '../utils/google/YoutubeUtils';
import HttpUtil from '../utils/httpUtil';
import path from 'path';
import fs from "fs";
import {createFolderIfNotExist, escapeFileName, getThrottleFunc} from '../utils/ezoomUtils';

// 連接到 lowdb 資料檔
ipcMain.handle('connect-to-json-db', async (event, args) => {

    const db = DbUtils.getDataBase({
        filePath: path.resolve(__dirname, '../data/db.json'),
        defaultJson: {google: {tokens: null, clientId: '', clientSecret: ''}, hahowToken: '', courses: []}
    });

    DbUtils.setGlobalDB(db);
    return 'connect done !';
});

ipcMain.handle('get-json-db-all-info', (event, args) => {

    return DbUtils.getGlobalDB().getState();
});

ipcMain.handle('google-login', async (event, {clientId, clientSecret}) => {

    DbUtils.updateGoogleOAuth2Info({clientId, clientSecret});
    const savedTokens = DbUtils.getSavedTokens();

    const oauth2Util = new GoogleOAuth2Util({
        clientId,
        clientSecret,
        scopes: ['https://www.googleapis.com/auth/youtube'], // scope for add playlist . upload video ...
        saveToken: tokens => DbUtils.updateGoogleOAuth2Info({tokens})
    });

    try {

        const tokens = await oauth2Util.openAuthPageAndGetAuthorizationCode(savedTokens);
        return {...tokens, googleApis: null};

    } catch (e) {
        console.error(e);
    }

});

// .handle method can return result to ipcRenderer.invoke
ipcMain.handle('save-hahowToken', async (event, apiKey) => {

    DbUtils.setHahowToken(apiKey);
    return 'you save hahow success';
});

// 取得個人購買的所有課程
ipcMain.handle('get-personal-courses', async () => {

    const token = DbUtils.getHahowToken();
    if (!token) throw new Error('hahow token not exist error');
    else {

        const courses = await HahowUtils.getBoughtCourses({token});
        DbUtils.setCourses(courses);

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

// 取得課程詳細資訊
ipcMain.handle('get-course-videos', async (event, course_id) => {

    const token = DbUtils.getHahowToken();
    const filePath = path.resolve(__dirname, `../data/course_${course_id}-videoInfos.json`);

    // 取得課程資訊
    const lectureIds = await HahowUtils.getLectureIdsByCourseId({course_id, token});
    const videoInfos = await Promise.all(lectureIds.map(lectureId => HahowUtils.getLectureInfo({lectureId, token})));

    const database = DbUtils.getDataBase({
        filePath,
        defaultJson: {videos: []}
    });

    if (fs.existsSync(filePath)) {

        // 如果已有課程資訊 , 將新舊資訊做整合
        const oldVideoInfos = database.get('videos').value();

        // 將 oldVideoInfos 中的 percent, downloadedLength 欄位作保留 , 其他的欄位用新的
        const mergedVideoInfos = videoInfos.map(videoInfo => {

            const oldVideoInfo = oldVideoInfos.find(({lectureId}) => lectureId === videoInfo.lectureId);
            return {...oldVideoInfo, ...videoInfo}
        });

        database.set('videos', mergedVideoInfos).write();
        return mergedVideoInfos;

    } else {

        database.set('videos', videoInfos).write();
        return videoInfos;
    }
});

// 將 MP4 下載完成的資訊存入檔案中
ipcMain.on('update-videoInfo', (event, args) => {

    const {course_id, lectureId, percent, downloadedLength} = args;
    const filePath = path.resolve(__dirname, `../data/course_${course_id}-videoInfos.json`);
    const database = DbUtils.getDataBase({filePath});

    database.get('videos')
        .find({lectureId})
        .assign({percent, downloadedLength})
        .write();
});

// 開啟 MP4 檔案 , 直接觀看
ipcMain.on('open-mp4', (event, {courseTitle, videoTitle}) => {

    const destFolder = path.resolve(__dirname, `../data/videos/${escapeFileName(courseTitle)}`);
    const targetPath = `${destFolder}/${escapeFileName(videoTitle)}-video.mp4`;

    // Open the given file in the desktop's default manner.
    shell.openPath(targetPath);
});

// 用瀏覽器開啟指定的 URL
ipcMain.on('open-external-url', (event, url) => shell.openExternal(url));

// 用瀏覽器開啟指定的 URL
ipcMain.on('open-url', (event, url) => {

    const win = new BrowserWindow({
        width: 600,
        height: 400,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../public/elearning.ico'),
    });

    win.loadURL(url);

    const currentUrl = win.webContents.getURL();
    console.log(currentUrl);
});

const downloadStreams = {};

ipcMain.handle('pause-download-video', (event, url) => {

    return new Promise((resolve, reject) => {

        try {

            const duplexStream = downloadStreams[url];
            duplexStream.pause(); // 暫停下載
            setTimeout(resolve, 500);

        } catch (err) {
            reject(err);
        }
    });
});

ipcMain.handle('resume-download-video', (event, url) => {

    const duplexStream = downloadStreams[url];
    duplexStream.resume(); // 繼續下載
    return 'resume';
});

ipcMain.handle('cancel-download-video', (event, url) => {

    const duplexStream = downloadStreams[url];
    return duplexStream.cancel(); // .finished(); // 取消下載
});

// 換頁到 Download 顯示課程詳細資訊
ipcMain.on('download-video', (event, {url, courseId, courseTitle, lectureId, videoTitle}) => {

    const downloadVideo = (videoUrl) => {

        const destFolder = path.resolve(__dirname, `../data/videos/${escapeFileName(courseTitle)}`);
        createFolderIfNotExist(destFolder);
        const cb = info => {

            const throttleId = `download-video-${courseTitle}-${lectureId}`;
            getThrottleFunc(throttleId, 500)(() => event.reply('update-download-progress', {...info, lectureId}));
        };

        return HttpUtil.videoDownload(videoUrl, `${destFolder}/${escapeFileName(videoTitle)}-video.mp4`, cb);
    };

    const getLectureInfo = async (lectureId, courseId) => {

        const token = DbUtils.getHahowToken();
        const lectureInfo = await HahowUtils.getLectureInfo({lectureId, token});
        const filePath = path.resolve(__dirname, `../data/course_${courseId}-videoInfos.json`);
        const database = DbUtils.getDataBase({filePath});

        database.get('videos')
            .find({lectureId})
            .assign(lectureInfo)
            .write();

        return lectureInfo;
    };

    // 確認 videoUrl 是否有效 , 當 videoUrl 無效時 ( HEAD method 呼叫 url 會回傳 statusCode = 410 Gone ) , 需要取得一個新的
    HttpUtil.checkVideoExist(url)
        .then(videoExist => {

            if (videoExist) downloadStreams[url] = downloadVideo(url);
            else {

                getLectureInfo(lectureId, courseId)
                    .then(({videoUrl}) => downloadStreams[videoUrl] = downloadVideo(videoUrl))
            }
        })
        .catch(err => console.error(err));
});

// 上傳影片
ipcMain.handle('upload-video', async (event, args) => {

    const {videoTitle, courseTitle, description} = args;
    const destFolder = path.resolve(__dirname, `../data/videos/${escapeFileName(courseTitle)}`);
    const targetPath = `${destFolder}/${escapeFileName(videoTitle)}-video.mp4`;

    const savedTokens = DbUtils.getSavedTokens();

    const googleApis = GoogleOAuth2Util.getGoogleApis(savedTokens);
    await new YoutubeUtils().addVideo({googleApis, fileName: targetPath, title: videoTitle, description});
    return 'OK!';
});

ipcMain.on('save-google-auth-info', (event, {clientId, clientSecret}) => {

    DbUtils.updateGoogleOAuth2Info({clientId, clientSecret});
});