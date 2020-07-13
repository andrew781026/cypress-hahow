import fs from "fs";
import path from "path";

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
