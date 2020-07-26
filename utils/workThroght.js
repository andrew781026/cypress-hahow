/**
 * 使用說明
 * 1. 安裝 Node.js
 * 2. 修改 run01 的參數 : dir / ext
 * 3. 在 cmd 中下 node workThroght.js 執行本 JS 檔
 * 備註 : 此刪除方式 , 不會將檔案放到垃圾桶 , 請小心使用 !
 */
const fs = require('fs');
const path = require('path');

/**
 * 列出資料夾中的所有檔案
 * @param dir 目標資料夾路徑
 * @param cb 找到檔案時 , 做的事情
 */
function traverseDir(dir, cb) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            // 資料夾
            // console.log(fullPath);
            traverseDir(fullPath);
        } else {
            // 檔案
            // console.log(fullPath);
            cb(fullPath);
        }
    });
}

/**
 * 刪除有特定副檔名的檔案
 * @param dir 目標資料夾路徑
 * @param ext 副檔名 , 單一類型 ( ex : pdf )
 */
const run01 = (dir, ext) => {

    const cb = (fullPath) => {

        if (fullPath.endsWith(`.${ext}`)) {

            fs.unlinkSync(fullPath) // 刪除檔案
        }
    };

    // 走遍所有資料夾中的檔案
    traverseDir(dir,cb);
};

run01('E:/test','pdf');