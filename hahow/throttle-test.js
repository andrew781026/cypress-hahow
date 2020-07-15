
// 自製 throttle 函數 , 參考資料 : https://mropengate.blogspot.com/2017/12/dom-debounce-throttle.html
function throttle(func, threshhold = 250) {
    var last, timer;
    return function () {
        var context = this
        var args = arguments
        // console.log('args=',args); // show : [Arguments] { '0': [Function: runFn] }
        var now = +new Date()
        if (last && now < last + threshhold) {
            clearTimeout(timer)
            timer = setTimeout(function () {
                last = now
                func.apply(context, args) // 如果 apply 的 args 是個函數 , 會直接呼叫之
            }, threshhold)
        } else {
            last = now
            func.apply(context, args)
        }
    }
}

const throttleMap = {};

const getThrottleFunc = (throttleId, wait = 1000) => {

    const tempFunc = throttleMap[`${throttleId}`];

    if (tempFunc) return tempFunc;
    else {

        const newTempFunc = throttle(func => func(), wait);
        throttleMap[`${throttleId}`] = newTempFunc;
        return newTempFunc;
    }
};

const thFn = getThrottleFunc('temp-01');
const now = new Date().getTime();

// thFn 會讓 runFn 1秒才執行一次
setInterval(() => {

    const runFn = () => console.log('thFn run in ', (new Date().getTime() - now) / 1000, ' 秒');
    thFn(runFn);

}, 100);
