const fs = require('fs');
require('events').defaultMaxListeners = 15;
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

let nextClassInfo = {}; // 下一堂課的 Url
const arr = [];
let callback = _ => _;
let counter = 0;

myEmitter.on('addItem', ({text, href, cb}) => {
    arr.push({text, href});
    callback = cb;
});

myEmitter.on('appendUrl', ({videoUrl}) => {
    arr[arr.length - 1][`videoUrl_${++counter}`] = videoUrl;
    if (counter % 4 === 0) myEmitter.emit('response');
});

myEmitter.on('setNextClassUrl', ({text, href}) => {
    nextClassInfo = {text, href};
});

myEmitter.on('response', () => {

    console.log(arr);
    // save arr to file
    // the flag list : https://nodejs.org/api/fs.html#fs_file_system_flags
    fs.writeFileSync('./videos.json', JSON.stringify(arr[arr.length - 1]), {flag: 'a+'});

    console.log(callback);

    // after response the data , we can call the next page
    callback();
});

module.exports = myEmitter;
