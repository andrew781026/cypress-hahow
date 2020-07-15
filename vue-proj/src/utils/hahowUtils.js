import HttpUtil from './httpUtil';

class HahowUtils {

    static async getBoughtCourses({token}) {

        const itemUrl = 'https://api.hahow.in/api/users/me/boughtCourses';
        return await HttpUtil.get({url: itemUrl, token});
    };

    // 2. 用 videoProgress 取得課程相關 ID ( ex : lecture_id )
    /* the videoProgressUrl response like below
        ASSIGNMENT 是作業 / LECTURE 是課程
    [
       {
           "_id": "5c91835ced65c200740ef386",
           "title": "課程介紹與導讀",
           "items": [
                {
                   "type": "LECTURE",
                   "_id": "5a1e1755a2c4b000589dda06",
                   "content": {
                      "_id": "59131bf62fa2a607008bc8e6",
                      "moduleItem": "5a1e1755a2c4b000589dda06",
                      ...
                   }
                },
                ...
                {
                   "type": "ASSIGNMENT",
                   "_id": "5a1e1755a2c4b000589dda53",
                   "content": {
                      "_id": "586fae97a8aae907000ce722",
                      "moduleItem": "5a1e1755a2c4b000589dda53",
                      ...
                   }
                },
            ]
        },
    ...]
    */
    static async getLectureIdsByCourseId({course_id, token}) {

        const itemUrl = `https://api.hahow.in/api/courses/${course_id}/modules/items`;
        const data = await HttpUtil.get({url: itemUrl, token});

        return data
            .reduce((pre, curr) => [...pre, ...curr.items], [])
            .filter(single => single.type === 'LECTURE' && single.content.video.isExisted) // 是 LECTURE 類型且 有 video
            .map(single => single.content._id);
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
    static async getLectureInfo({lectureId, token}) {

        const lectureInfoUrl = `https://api.hahow.in/api/lectures/${lectureId}`;
        const data = await HttpUtil.get({url: lectureInfoUrl, token});

        return {
            lectureId,
            imageUrl: data.video.previewImageUrls.VIMEO && data.video.previewImageUrls.VIMEO.DIMENSION_W1000,
            videoUrl: data.video.videos.find(item => item.quality === 'hd' && item.width === 1920).link,
            totalLength: data.video.videos.find(item => item.quality === 'hd' && item.width === 1920).size,
            title: data.title,
            tempData: data
        };
    };
}

export default HahowUtils;