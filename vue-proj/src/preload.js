const fs = require('fs');
const path = require('path');
const os = require('os');
const dns = require('dns');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

    // setting many function on windows

    const registerFuncs = {};

    registerFuncs.appendText = (text) => {

        const newPath = path.resolve(__dirname, 'the-text.txt');

        // console.log('saving start at path=', newPath, ';text=', text);

        fs.writeFileSync(newPath, text + '\n', {
            encoding: 'utf8',
            flag: 'a' // append text to the end of text file
        });
    };

    // os.networkInterfaces , 參考資料 : https://nodejs.org/dist/latest-v12.x/docs/api/os.html#os_os_networkinterfaces
    registerFuncs.getIpInfo = () => {

        const obj = os.networkInterfaces();
        return Object.keys(obj).reduce((pre, curr) => {

            const arr = obj[curr].map(single => ({...single, name: curr}));
            return [...pre, ...arr];

        }, []);
    };

    // dns.getServers , 參考資料 : https://nodejs.org/api/dns.html#dns_dns_getservers
    registerFuncs.getDnsServers = () => dns.getServers();

    // 將設定的 function 掛載到 window 上
    window.registerFuncs = registerFuncs;
});
