import fs from "fs";
import path from "path";
import sanitize from "sanitize-filename";

export const getLocalInfo = () => {

    // 參考資料 : https://nodejs.org/dist/latest-v12.x/docs/api/os.html#os_os_networkinterfaces
    const os = require('os');
    return os.networkInterfaces();
};

export const getDnsInfo = () => {

    // 參考資料 : https://nodejs.org/api/dns.html#dns_dns_getservers
    const dns = require('dns');
    return dns.getServers();
};

export const createFileIfNotExist = targetPath => {

    if (fs.existsSync(targetPath)) return 'file db.json already exist';
    else {

        if (!fs.existsSync(path.resolve(targetPath, '..'))) {
            fs.mkdirSync(path.resolve(targetPath, '..'), {recursive: true});
        }

        fs.writeFileSync(targetPath, '');
        return 'success create file db.json';
    }
};

export const createFolderIfNotExist = targetPath => {

    if (fs.existsSync(path.resolve(targetPath))) return 'target folder already exist';
    else return fs.mkdirSync(path.resolve(targetPath), {recursive: true});
};

export const escapeFileName = fileName => sanitize(fileName, {replacement: '_'}).replace(' ','_');

export function debounce(func, delay) {
    var timer = null;
    return function () {
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(context, args), delay);
    }
}

export function throttle(func, threshhold = 250) {
    var last, timer;
    return function () {
        var context = this
        var args = arguments
        var now = +new Date()
        if (last && now < last + threshhold) {
            clearTimeout(timer)
            timer = setTimeout(function () {
                last = now
                func.apply(context, args)
            }, threshhold)
        } else {
            last = now
            func.apply(context, args)
        }
    }
}

const throttleMap = {};

// Define the method directly in your class
// 產生延遲一秒效果的 function
// 參考資料 : https://stackoverflow.com/questions/36294134/lodash-debounce-with-react-input
export const getThrottleFunc = (throttleId, wait = 1000) => {

    const tempFunc = throttleMap[`${throttleId}`];

    if (tempFunc) return tempFunc;
    else {

        const newTempFunc = throttle(func => func(), wait);
        throttleMap[`${throttleId}`] = newTempFunc;
        return newTempFunc;
    }
};