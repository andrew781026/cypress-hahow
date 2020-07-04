const ss = async () => {

    return new Promise((resolve, reject) => {

        resolve(5);
        console.log('here will access');
    });

};

// ss().then(s => console.log(s));

const fs = require('fs');
const data = JSON.stringify([{url: 'www.google.com', text: 'Google 搜尋'}]);

// const result = fs.writeFileSync('./videos.json', '\n' + data, {flag: 'a+'});
// console.log('result=', result);

String.prototype.show = function () {
    return console.log(this);
};

'QQ'.show();

// ref : https://stackoverflow.com/questions/28241002/moment-js-include-text-in-middle-of-date-format
const moment = require('moment');
const str = moment().format('YYYY-MM-DD_HH[h]mm[m]ss[s]');
console.log('str=',str);