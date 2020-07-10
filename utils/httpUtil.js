const Axios = require('axios');
const download = require('download');
const fs = require('fs');

const getApiToken = jwtToken => `Bearer ${jwtToken}`;

const HttpUtil = {
    async get({url, token}) {

        const response = await Axios({
            method: "GET",
            url,
            headers: {Authorization: getApiToken(token)},
        });

        return await response.data;
    },
    download,
    videoDownload: (url, dest, cb) => {

        return new Promise((resolve, reject) => {

            let downloadedLength = 0;
            const writeStream = fs.createWriteStream(dest);
            writeStream.on("finish", () => resolve('you success download the video'));
            writeStream.on("error", err => reject(err));

            download(url)
                .on('response', res => {
                    const totalLength = res.headers['content-length'];

                    res.on('data', data => {
                        downloadedLength += data.length;
                        cb({data, downloadedLength, totalLength});
                    });
                })
                .pipe(writeStream);
        });
    }
};

module.exports = HttpUtil;