<template>
    <div class="root w-full flex flex-col border-collapse overflow-auto">
        <div class="flex justify-start p-12 border border-solid"
             v-for="(item,index) in videos" :key="`download-list-${index}`">
            <img class="cursor-pointer" :src="item.imageUrl" alt="課堂圖片"
                 width="120px" @click="showLightBox(item.imageUrl)">
            <div class="download-progress-block">
                <span class="truncate" :title="item.title">
                    標題 : {{item.title}}
                </span>
                <span>檔名 : </span>
                <div class="progress">
                    <div class="progress-bar w-256" role="progressbar"
                         aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span>下載量 : 147,254 / 257,246</span>
            </div>
            <div class="flex flex-col ml-12 items-center">
                <button type="button" class="btn btn-primary mb-6" @click="downloadVideo">
                    <img class="img-btn" src="../assets/upload.png" alt="上傳">
                    <span>上傳</span>
                </button>
                <button type="button" class="btn btn-warning" @click="downloadVideo">
                    <img class="img-btn" src="../assets/download.png" alt="下載">
                    <span>下載</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        name: "Download",
        props: {
            videos: Array
        },
        mounted() {

            console.log('videos=', this.videos);
        },
        methods: {
            ...mapActions({
                showLightBox: '[MAIN] SHOW_LIGHT_BOX',
            }),
            downloadVideo() {
                console.log('start to download video');
            },
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
        min-width: 520px;
        max-width: 520px;
        margin-left: 10px;
    }
</style>