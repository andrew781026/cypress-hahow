const fs = require('fs');
const {download, videoDownload} = require('../utils/httpUtil');

/*
const writeStream = fs.createWriteStream('./video.mp4');
writeStream.on("finish", () => console.log('you success download the video'));
writeStream.on("error", err => console.error(err));

let downloadedLength = 0;

// use .on('response', 參考資料 : https://github.com/kevva/download/issues/106
download('https://player.vimeo.com/external/180894020.sd.mp4?s=a71775ce12b6d41c413bbab8c6dff7d858015d0e&profile_id=165')
    .on('response', res => {
        const length = res.headers['content-length'];

        res.on('data', data => {
            downloadedLength += data.length;
            console.log('downloadedLength=', downloadedLength);
        });
    })
    .pipe(writeStream);
*/
videoDownload('https://player.vimeo.com/external/180894020.sd.mp4?s=a71775ce12b6d41c413bbab8c6dff7d858015d0e&profile_id=165',
    './video.mp4',
    res => {

        const {data, downloadedLength, totalLength} = res;
        console.log(`totalLength= ${totalLength} and downloadedLength= ${downloadedLength} ,the progress is ${(downloadedLength / totalLength) * 100} %`);
    })
