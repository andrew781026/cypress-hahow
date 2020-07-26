<template>
    <div>
        <button type="button" class="btn btn-primary ml-12 mt-12" @click="getBoughtCourses">
            取得我的課程
        </button>
        <button type="button" class="btn btn-danger ml-12 mt-12" @click="addErrMsg">
            新增錯誤訊息
        </button>
        <div id="show-courses" class="pl-20 pb-32 flex flex-wrap w-full">
            <template v-for="(item,index) in courses">
                <div class="relative mr-20 mt-40 course-container" :key="index" @click="getCourseVideos(item)">
                    <!-- 課程圖片 -->
                    <img class="author-avatar" alt="author-avatar"
                         :src="item.owner.profileImageUrl" :title="item.owner.name"/>
                    <div class="img-container overflow-hidden relative bg-orange-light">
                        <img class="course-img" :src="item.coverImage.url" alt="course-img">
                        <div class="ribbon">上課囉</div>
                    </div>
                    <div class="text-container p-12">
                        <h4 class="course-title">{{item.title}}</h4>
                        <div class="flex items-center mb-6">
                            <div class="course-progress-bar">
                                <div class="progress"
                                     :style="{width:`${Math.round(item.lecturesVideoProgress*100)}%`}"></div>
                            </div>
                            <template>
                                <img v-if="item.certificateAcquired" class="w-16 h-16"
                                     src="../assets/medal-color.png" alt="finish-course"/>
                                <img v-else class="w-16 h-16" style="opacity: 0.2"
                                     src="../assets/medal-black.png" alt="start-course"/>
                            </template>
                        </div>
                        <div class="flex justify-between">
                            <span>上課 {{Math.round(item.lecturesVideoProgress*100)}}%</span>
                            <span>尚未評價</span>
                        </div>
                        <div class="flex justify-between">
                            <span>作業 0%</span>
                            <span>*****</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import Toastify from 'toastify-js'

    export default {
        name: "Courses",
        mounted() {

        },
        methods: {
            ...mapActions({
                openLoadingMask: '[MAIN] OPEN_LOADING_MASK',
                closeLoadingMask: '[MAIN] CLOSE_LOADING_MASK',
            }),
            getBoughtCourses() {

                this.openLoadingMask();
                window.ipcRenderer.invoke('get-personal-courses')
                    .then(courses => {
                        this.courses = courses;
                        this.closeLoadingMask();
                    })
                    .catch(err => console.error(err)); // TODO 顯示取得資料失敗

                // const course_id = '56189df9df7b3d0b005c6639';
            },
            getCourseVideos(course) {

                this.openLoadingMask();
                window.ipcRenderer.invoke('get-course-videos', course._id)
                    .then(videos => {
                        this.$router.push({name: 'Download', params: {videos, course}});
                        this.closeLoadingMask();
                    })
                    .catch(err => console.error(err));

                // const course_id = '56189df9df7b3d0b005c6639';
            },
            addErrMsg() {

                // https://www.youtube.com/watch?v=kkuZTAMyAFI
                // https://apvarun.github.io/toastify-js/#

                Toastify({

                    text: "This is a toast",
                    position: 'center',
                    backgroundColor: "red",
                    duration: 3000

                }).showToast();
            }
        },
        data() {

            return {
                height: 1,
                courses: [
                    {
                        "creationsProgress": 0,
                        "lecturesVideoProgress": 0.034482758620689655, // 課程完成度
                        "certificateAcquired": false, // 是否完成課程
                        "status": "PUBLISHED", // 課程狀態
                        "averageRating": 4.98, // 平均星數
                        "numRating": 333, // 總星數
                        "_id": "56189df9df7b3d0b005c6639",
                        "assignment": "56189df9df7b3d0b005c663a",
                        "owner": {
                            "_id": "56189df7df7b3d0b005c6638",
                            "profileImageUrl": "https://hahow.in/images/59940a4d38c46c0700654afc", // 講師頭像
                            "name": "吳哲宇", // 講師名稱
                            "username": "majer"
                        },
                        "title": "動畫互動網頁程式入門 (HTML/CSS/JS)",
                        "metaDescription": "互動網頁程式設計課程，教你用 illustrator 的思維來學習網頁前端程式設計，從網站的結構開始設計，掌握 JS、HTML、CSS 等程式語法，帶你製作出實用且美觀的互動式網頁。",
                        "coverImage": {
                            "_id": "5b8726df297df5001efb75c0",
                            "url": "https://images.api.hahow.in/images/5b8726df297df5001efb75c0" // 課程圖片
                        },
                        "totalVideoLengthInSeconds": 104721, // 課程時長
                    },
                ]
            }
        }
    }
</script>

<style scoped lang="scss">

    .course-progress-bar {
        width: 80%;
        height: 10px;
        border-radius: 8px;
        background-color: #cccccc;
        margin-right: 8px;
        overflow: hidden;
        position: relative;

        .progress {
            left: 0;
            top: 0;
            background-color: #0093A3;
            border-radius: 0;
            position: absolute;
            height: 100%;
        }
    }

    .course-title {
        max-height: 60px;
        overflow: hidden;
    }

    .course-container {

        max-width: 220px;
        min-width: 220px;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.24);
        cursor: pointer;

        &:hover {
            background-color: #d1d1d1;

            .course-progress-bar {
                background-color: #b7b7b7;
            }
        }

        &:active {
            background-color: #b7b7b7;

            .course-progress-bar {
                background-color: #a3a3a3;
            }
        }
    }

    .img-container {

        .ribbon {
            position: absolute;
            background-color: #00c098;
            overflow: hidden;
            top: 12px;
            right: -29px;
            width: 115px;
            transform: rotate(45deg);
            color: white;
            text-align: center;
            z-index: 2;
        }

        .course-img {
            width: 100%;
            background-size: contain;
            transition: all 0.3s;
        }

        &:hover {
            .course-img {
                transform: scale(1.3);
            }
        }
    }

    .author-avatar {
        position: absolute;
        top: 0;
        left: 8px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px 0 black; /* the outer black line */
        object-position: left top;
        object-fit: cover;
        transform: translateY(-50%);
        z-index: 2;
    }
</style>
