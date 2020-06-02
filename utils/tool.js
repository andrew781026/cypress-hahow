const promiseAll = async (promises, concurrency = 5) => {

    const result = [];
    const length = promises.length;
    const times = Math.ceil(length / concurrency);

    for (let i = 0; i < times; i++) {

        const pageEnd = concurrency * (i + 1);
        const end = Math.min(pageEnd, length);
        const arr = promises.slice(concurrency * i, end);
        result.push(await Promise.all(arr));
        // console.log('arr=', result[i]);
    }

    return result.reduce((pre, curr) => [...pre, ...curr], []);
};

const mapReplace = (str, replaceMap = {}) => {

    const cb = (pre, curr) => pre.replace(curr, replaceMap[curr]);
    return Object.keys(replaceMap).reduce(cb, str);
};

const stringHook = (name,func) => {

    // 將 func 函數 , 掛勾到 String 上
    String.prototype[name] = function (...params) {

        // 用 this.toString() 將 this 物件轉換成字串
        return func(this.toString(), ...params);
    }
};

const deleteFolderRecursive = function(path) {

    const fs = require('fs');
    const Path = require('path');

    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

module.exports = {
    promiseAll,
    mapReplace,
    stringHook,
    deleteFolderRecursive,
};
