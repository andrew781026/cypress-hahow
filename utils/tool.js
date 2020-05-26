const promiseAll = async (promises, concurrency = 5) => {

    const result = [];
    const length = promises.length;
    const times = Math.ceil(length / concurrency);

    for (let i = 0; i < times; i++) {

        const pageEnd = concurrency * (i + 1);
        const end = Math.min(pageEnd, length);
        const arr = promises.slice(concurrency * i, end);
        result.push(await Promise.all(arr));
        // console.log('arr=', result[i]);
    }

    return result.reduce((pre, curr) => [...pre, ...curr], []);
};

const mapReplace = (str, replaceMap = {}) => {

    const cb = (pre, curr) => pre.replace(curr, replaceMap[curr]);
    return Object.keys(replaceMap).reduce(cb, str);
};

const hook = () => {

    // 將 mapReplace 函數 , 掛勾到 String 上
    String.prototype.mapReplace = function (replaceMap) {

        // 用 this.toString() 將 this 物件轉換成字串
        return mapReplace(this.toString(), replaceMap);
    }
};

module.exports = {
    promiseAll,
    mapReplace,
    hook
};
