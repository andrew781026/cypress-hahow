const fs = require('fs');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

let nextClassInfo = {}; // 下一堂課的 Url
const arr = [];
let callback = _ => _;

myEmitter.on('addItem', ({text, href, cb}) => {
    arr.push({text, href});
    console.log(cb);
    callback = cb;
    console.log(arr);
});

myEmitter.on('appendUrl', ({videoUrl}) => {
    arr[arr.length - 1].videoUrl = videoUrl;
});

myEmitter.on('setNextClassUrl', ({text, href}) => {
    nextClassInfo = {text, href};
});

myEmitter.on('response', () => {

    // save arr to file
    fs.appendFile('./videos.json', JSON.stringify(arr[arr.length - 1]));

    console.log(callback);

    // after response the data , we can call the next page
    callback();
});

module.exports = myEmitter;
