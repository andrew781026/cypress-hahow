import path from "path";
import {BrowserWindow} from "electron";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";

export function createWindow({width, height}) {

    // Create the browser window.
    let win = new BrowserWindow({
        width,
        height,
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

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        // if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.on('closed', () => win = null);

    return win;
}
