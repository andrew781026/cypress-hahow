const fs = require('fs');
const path = require('path');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

    // setting many function on windows

    const registerFuncs = {};

    registerFuncs.appendText = (text) => {

        const newPath = path.resolve(__dirname, 'the-text.txt');

        console.log('saving start at path=', newPath, ';text=', text);

        fs.writeFileSync(newPath, text + '\n', {
            encoding: 'utf8',
            flag: 'a' // append text to the end of text file
        });
    };

    // 將設定的 function 掛載到 window 上
    window.registerFuncs = registerFuncs;
});
