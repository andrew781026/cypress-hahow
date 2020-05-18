// 參考資料 : https://segmentfault.com/a/1190000019961682

const loadtest = require('loadtest');
const {linebotUrls} = require('./pass');

const statusCallback = (error, result, latency) => {
    console.log('Current latency %j, error %j', latency, error);
    console.log('----');
    console.log('Request elapsed milliseconds: ', result.requestElapsed);
    console.log('Request index: ', result.requestIndex);
    console.log('Request loadtest() instance index: ', result.instanceIndex);
};

const options = {
    url: linebotUrls.stg_url,
    maxRequests: 1000,
    statusCallback
};

loadtest.loadTest(options, function (error, result) {
    if (error) {
        return console.error('Got an error: %s', error);
    }
    console.log('Tests run successfully');
});
