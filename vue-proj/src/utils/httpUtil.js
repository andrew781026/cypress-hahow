const Axios = require('axios');
const download = require('download');
const fs = require('fs');

const getApiToken = jwtToken => `Bearer ${jwtToken}`;

const HttpUtil = {
    async get({url, token}) {

        return new Promise((resolve, reject) => {

            Axios({
                method: "GET",
                url,
                headers: {Authorization: getApiToken(token)},
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        })
    },
    download,
    async checkVideoExist(url) {

        try {

            await Axios({method: "HEAD", url}); // 使用 HEAD method 去確認是否存在
            return true; // video exist on input url

        } catch (err) {

            if (err && err.response && err.response.status === 410) {

                return false; // statusCode = 410 Gone

            } else throw err;
        }
    },
    videoDownload: (url, dest, cb) => {

        let downloadedLength = 0;
        const writeStream = fs.createWriteStream(dest);
        // writeStream.on("finish", () => resolve('you success download the video'));
        // writeStream.on("error", err => reject(err));

        const duplexStream = download(url);

        duplexStream.on('response', res => {
            const totalLength = res.headers['content-length'];

            res.on('data', data => {
                downloadedLength += data.length;
                cb({data, downloadedLength, totalLength});
            });
        });

        duplexStream.on("error", err => console.error(err));

        duplexStream.pipe(writeStream);

        // duplexStream.pause();  // 下載暫停
        // duplexStream.resume(); // 下載繼續
        return duplexStream;
    },
    srtDownload: (url, dest) => {

        const writeStream = fs.createWriteStream(dest);

        const duplexStream = download(url);

        duplexStream.on("error", err => console.error(err));

        duplexStream.pipe(writeStream);

        // duplexStream.pause();  // 下載暫停
        // duplexStream.resume(); // 下載繼續
        return duplexStream;
    }
};

module.exports = HttpUtil;