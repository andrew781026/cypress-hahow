// 1. 取得 jwtToken - 可能有效期為 1 小時

// 2. 用 videoProgress 取得課程相關 ID ( ex : lecture_id )

const Axios = require('axios');

const HttpUtil = {
    async get({url, token}) {

        const response = await Axios({
            method: "GET",
            url,
            headers: {Authorization: getApiToken(token)},
        });

        return await response.data;
    },
};

const getApiToken = jwtToken => `Bearer ${jwtToken}`;

/* the videoProgressUrl response like below
[
    {
        "status": "PLAYED",
        "progressInSeconds": 258.593,
        "_id": "5db81c98a29ef8cc770*****",
        "course": "586fae97a8aae907000*****",
        "lecture": "591d0f1f00f58c07007*****",
        "owner": "5c592fc679f1990022d*****"
    },
...]
*/
const getLectureIds = async ({classId, token}) => {

    const videoProgressUrl = `https://api.hahow.in/api/users/me/boughtCourses/${classId}/videoProgresses`;
    const data = await HttpUtil.get({url: videoProgressUrl, token});
    console.log('data=', data);
    return data.map(item => item.lecture);
};

// 3. 用 lecture_id 取得課程某章節資訊 ( 章節說明文字 . 影片網址 ...等 )

/* the lectureInfoUrl response like below
{
  "migratedToWistia": true,
  "_id": "591d0f1f00f58c070078944e",
  "updatedAt": "2019-03-20T12:12:56.180Z",
  ...
  "course": "586fae97a8aae907000ce721",
  "moduleItem": "5a1e1755a2c4b000589dda07",
  "title": "課程路線與學習方式",
  "description": ...,
  "video": {
    "_id": "59943f0e4521fa0700e72ceb",
    "previewImageUrls": {
      "HAHOW": {
        "DIMENSION_W300": "https://images.api.hahow.in/images/599404c538c46c0700654a9f?width=300",
      },
    },
    "wistiaHashedId": "6qhblzmwj9",
    "videos": [
      ...
      {
        "quality": "sd",
        "width": 960,
        "height": 540,
        "size": 19651576,
        "link": "https://player.vimeo.com/play/811034616?s=229820954_1590418455_534713971a5f6889de168eb6d60d3f8e",
        "expires": "2020-05-25T05:54:15.000Z"
      },
      ...
    ],
    ...
  }
}
*/
const getLectureInfo = async ({lectureId, token}) => {

    const lectureInfoUrl = `https://api.hahow.in/api/lectures/${lectureId}`;
    const data = await HttpUtil.get({url: lectureInfoUrl, token});
    const video = data.video.videos.find(item => item.quality === 'sd' && item.width === 960);
    return {link: video.link, title: data.title};
};

// 產生一個 async function 並立即執行他
(async () => {

    const {token} = require('./response/passport');
    const clazz = {
        id: '586fae97a8aae907000ce721',
        name: "動畫互動網頁特效入門（JS/CANVAS）",
        author: "吳哲宇",
    };

    const lectureIds = await getLectureIds({classId: clazz.id, token});

    const promiseIterator = lectureIds.map(lectureId => getLectureInfo({lectureId, token}));

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

    const lectureInfoArray = await promiseAll(promiseIterator, 5);

    console.log('lectureInfoArray=', lectureInfoArray);
    fs.writeFileSync('./videos.json', JSON.stringify(lectureInfoArray));
})();

// push the mp4 to personal private channel in youtube


// make it become electron App
