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
                <span>檔名 : <span v-if="item.percent > 0">{{item.lectureId}}-video.mp4</span></span>
                <div class="progress">
                    <div :class="['progress-bar', 'w-256',
                            item.percent !== 100 && 'progress-bar-striped',
                            item.percent !== 100 && 'progress-bar-animated']"
                         role="progressbar" :style="{width: `${item.percent || 0}%`}">
                        {{Math.floor(item.percent || 0)}} %
                    </div>
                </div>
                <span>下載量 : {{numberFormatter(item.downloadedLength || 0)}} / {{numberFormatter(item.totalLength)}}</span>
            </div>
            <div class="flex flex-col ml-6 items-center">
                <button type="button" class="btn btn-primary mb-6">
                    <img class="img-btn" src="../assets/upload.png" alt="上傳">
                    <span>上傳</span>
                </button>
                <button type="button" class="btn btn-warning mb-6" @click="downloadVideo(item)">
                    <img class="img-btn" src="../assets/download.png" alt="下載">
                    <span>下載</span>
                </button>
            </div>
            <div class="flex flex-col ml-6 items-center">
                <button type="button" class="btn btn-success" @click="downloadVideo(item)">
                    <img class="img-btn" src="../assets/play-mp4.png" alt="下載">
                    <span>開啟</span>
                </button>
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
            courseId: String,
        },
        mounted() {

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

                window.ipcRenderer.send('download-video', {
                    url: videoInfo.videoUrl,
                    courseId: this.courseId,
                    lectureId: videoInfo.lectureId
                });
            },
            updateProgress(event, {lectureId, downloadedLength, totalLength}) {

                const percent = (downloadedLength / totalLength) * 100;
                if (this.videosInfo) {

                    const index = this.videosInfo.findIndex(video => video.lectureId === lectureId);
                    console.log('this.videos=', this.videos);
                    console.log('index=', index);
                    const singleVideo = this.videosInfo[index];
                    console.log('percent=', percent);
                    console.log('singleVideo=', singleVideo);
                    this.videosInfo.splice(index, 1, {...singleVideo, percent, downloadedLength, totalLength});
                }
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
        min-width: 450px;
        max-width: 450px;
        margin-left: 10px;
    }
</style>