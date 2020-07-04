import {ipcMain} from "electron";

ipcMain.on('call-getInfo',  (event, args) => {
    console.log('call-getInfo !!');
});

// .handle method can return result to ipcRenderer.invoke
ipcMain.handle('get-', async () => {
});

// 顯示上次下載的進度 ,
ipcMain.handle('get-pre-download-progress', async () => {

    // 直接查看下載資訊的檔案 , 確認此課程有多少沒下載 , 有多少已下載

    // TODO 以下事項
    // 1. 用 db.json 查出 目前最新的 A 課程相關資訊的 json 檔存哪裡
    // 2. 查看課程並撥放之
    // 3. 上傳檔案到 youtube 並形成系列影集並 4.上字幕
});


// 下載任務暫停與繼續下載 => 斷點續傳 : https://segmentfault.com/q/1010000019524002
