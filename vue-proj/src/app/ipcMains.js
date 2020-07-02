import {ipcMain} from "electron";

ipcMain.on('call-getInfo',  (event, args) => {
    console.log('call-getInfo !!');
});

// .handle method can return result to ipcRenderer.invoke
ipcMain.handle('get-', async () => {
});