import {app, protocol, BrowserWindow} from 'electron';
import Badge from 'electron-windows-badge';
import path from 'path';

import {
    createProtocol,
    /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import './app/ipcMains';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}])

async function createWindow() {

    // Create the browser window.
    win = new BrowserWindow({
        width: 850,
        height: 620,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../public/elearning.ico'),
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, 'preload.js'),
            // devTools: false,
        }
    });

    // Remove the window's menu bar.
    win.removeMenu();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        // 需要 await , vue_devtool 才能安裝成功
       await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.on('closed', () => {
        win = null
    });

    // 設定進度條
    win.setProgressBar(0.5);

    // 設定閃爍特效
    win.flashFrame(true);
    win.on('focus', () => win.flashFrame(false));

    // 設定數字小圖示
    const badgeOptions = {};
    new Badge(win, badgeOptions);

    // 3) To update the badge you just need to call this(you must do it in render process):
    // ipcRenderer.sendSync('update-badge', 1);

    // 4) To remove badge just call this(you must do it in render process):
    // ipcRenderer.sendSync('update-badge', null);

    return win;
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
   await createWindow()
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
