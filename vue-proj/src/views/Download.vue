<template>
    <div class="root w-full flex flex-col border-collapse overflow-auto">
        <div class="flex justify-start p-12 border border-solid"
             v-for="(item,index) in videosInfo" :key="`download-list-${index}`">
            <img class="cursor-pointer" :src="item.imageUrl" alt="課堂圖片"
                 width="120px" @click="showLightBox(item.imageUrl)">
            <div class="download-progress-block">
                <span class="truncate" :title="item.title">
                    標題 : {{item.title}}
                </span>
                <span>檔名 : <span v-if="item.percent > 0">{{item.title}}-video.mp4</span></span>
                <div class="progress">
                    <div :class="['progress-bar']"
                         role="progressbar" :style="{width: `${Math.floor(item.percent || 0)}%`}">
                        {{Math.floor(item.percent || 0)}} %
                    </div>
                </div>
                <span>下載量 : {{numberFormatter(item.downloadedLength || 0)}} / {{numberFormatter(item.totalLength)}}</span>
            </div>
            <div class="flex flex-col ml-6 items-center">
                <template v-if="item.percent !== 100">
                    <button type="button" class="btn btn-danger mb-6"
                            v-if="item.isDownloading">
                        <img class="img-btn" src="../assets/pause.png" alt="暫停">
                        <span>暫停</span>
                    </button>
                    <button type="button" class="btn btn-danger mb-6"
                            @click="downloadVideo(item)" v-else>
                        <img class="img-btn" src="../assets/download.png" alt="下載">
                        <span>下載</span>
                    </button>
                </template>
                <template v-else>
                    <button type="button" class="btn btn-primary mb-6">
                        <img class="img-btn" src="../assets/upload.png" alt="上傳">
                        <span>上傳</span>
                    </button>
                    <button type="button" class="btn btn-success" @click="openMp4(item)"
                            :disabled="item.percent !== 100">
                        <img class="img-btn" src="../assets/play-mp4.png" alt="撥放">
                        <span>撥放</span>
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import {numberFormatter} from '../utils/numberUtils';

    export default {
        name: "Download",
        props: {
            videos: Array,
            course: Object,
        },
        mounted() {

            document.title = 'Hahow 課程管理器 - 課程影片下載';
            this.videosInfo = [...(this.videos || [])];
            window.ipcRenderer.on('update-download-progress', this.updateProgress);
        },
        beforeDestroy() {

            window.ipcRenderer.removeListener('update-download-progress', this.updateProgress);
        },
        methods: {
            numberFormatter,
            ...mapActions({
                showLightBox: '[MAIN] SHOW_LIGHT_BOX',
            }),
            downloadVideo(videoInfo) {
                console.log('start to download video');

                const lectureId = videoInfo.lectureId;
                window.ipcRenderer.send('download-video', {
                    url: videoInfo.videoUrl,
                    courseTitle: this.course.title,
                    lectureId: videoInfo.lectureId,
                    videoTitle: videoInfo.title,
                });

                // 將 "下載按鈕" 轉變成 "暫停按鈕"
                if (this.videosInfo) {

                    const index = this.videosInfo.findIndex(video => video.lectureId === lectureId);
                    const singleVideo = this.videosInfo[index];
                    const newSingleVideo = {...singleVideo, isDownloading: true};
                    this.videosInfo.splice(index, 1, newSingleVideo);
                }
            },
            updateProgress(event, {lectureId, downloadedLength, totalLength}) {

                const percent = (downloadedLength / totalLength) * 100;

                // 更新 下載進度 : percent . downloadedLength
                if (this.videosInfo) {

                    const index = this.videosInfo.findIndex(video => video.lectureId === lectureId);
                    const singleVideo = this.videosInfo[index];
                    const newSingleVideo = {...singleVideo, percent, downloadedLength};
                    this.videosInfo.splice(index, 1, newSingleVideo);
                }

                // 完成下載時 , 更新 video 相關的 db.json 檔案
                if (percent === 100) {

                    window.ipcRenderer.send('update-videoInfo', {
                        course_id: this.course._id,
                        lectureId,
                        percent,
                        downloadedLength
                    });
                }
            },
            openMp4(videoInfo) {

                window.ipcRenderer.send('open-mp4', {
                    courseTitle: this.course.title,
                    videoTitle: videoInfo.title
                });
            }
        },
        data() {

            return {
                videosInfo: []
            }
        }
    }
</script>

<style scoped>
    .root {
        height: calc(100vh - 4.4rem);
    }

    .img-btn {
        width: 22px;
        margin-right: 7px;
        margin-bottom: 4px;
    }

    .download-progress-block {
        display: flex;
        flex-direction: column;
        min-width: 550px;
        max-width: 550px;
        margin-left: 10px;
    }
</style>