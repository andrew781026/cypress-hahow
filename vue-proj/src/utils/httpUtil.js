const Axios = require('axios');
const http = require('http');
const fs = require('fs');

const getApiToken = jwtToken => `Bearer ${jwtToken}`;

const download = function (url, dest, cb) {
    var file = fs.createWriteStream(dest);
    http.get(url, (response) => {
        const contentLength = response.getHeader('Content-Length');
        console.log('contentLength=', contentLength); // 取得影片大小

        // 取得下載的檔案
        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });

        response.pipe(file);

        // This is here incase any errors occur
        file.on('error', err => console.error(err));

        file.on('finish', () => file.close(cb));
    });
}

export const HttpUtil = {
    async get({url, token}) {

        const response = await Axios({
            method: "GET",
            url,
            headers: {Authorization: getApiToken(token)},
        });

        return await response.data;
    },
    download,
};
