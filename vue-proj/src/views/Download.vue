<template>
    <div>
        <div class="root w-full flex flex-col border-collapse overflow-auto">
            <div class="flex justify-between p-12 border border-solid">
                <img src="../assets/image.png" alt="">
                <div class="flex flex-col">
                    <span>標題 : 變數與判斷</span>
                    <span>檔名 : 240805563.sd.mp4</span>
                    <div class="progress">
                        <div class="progress-bar w-256" role="progressbar"
                             aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <span>下載量 : 147,254 / 257,246</span>
                </div>
                <img id="download" src="../assets/download.png" class="w-auto h-52" alt="">
                <img src="../assets/upload.png" class="w-auto h-52" alt="">
            </div>
            <div class="flex justify-between p-12 border border-solid">
                <img src="../assets/image.png" alt="">
                <div class="flex flex-col">
                    <span>標題 : 變數與判斷</span>
                    <span>檔名 : 240805563.sd.mp4</span>
                    <div class="w-256 relative min-h-12 rounded-24 border-1 border-solid">
                        <div class="absolute pin-l min-h-12 w-128 rounded-24 bg-blue"></div>
                    </div>
                    <span>下載量 : 147,254 / 257,246</span>
                </div>
                <div class="h-52 flex flex-col">
                    <img src="../assets/download.png" class="w-auto h-44" alt="">
                    <span>下載</span>
                </div>
                <div class="h-52 flex flex-col">
                    <img src="../assets/upload.png" class="w-auto h-full" alt="">
                    <span>上傳</span>
                </div>
            </div>
            <div class="flex justify-between p-12 border border-solid">
                <img src="../assets/image.png" alt="">
                <div class="flex flex-col">
                    <span>標題 : 變數與判斷</span>
                    <span>檔名 : 240805563.sd.mp4</span>
                    <div class="w-256 relative min-h-12 rounded-24 border-1 border-solid">
                        <div class="absolute pin-l min-h-12 w-128 rounded-24 bg-blue"></div>
                    </div>
                    <span>下載量 : 147,254 / 257,246</span>
                </div>
                <img src="../assets/download.png" class="w-auto h-52" alt="">
                <img src="../assets/upload.png" class="w-auto h-52" alt="">
            </div>
            <div class="flex justify-between p-12 border border-solid">
                <img src="../assets/image.png" alt="">
                <div class="flex flex-col">
                    <span>標題 : 變數與判斷</span>
                    <span>檔名 : 240805563.sd.mp4</span>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated w-3/4"
                             role="progressbar" aria-valuenow="75"
                             aria-valuemin="0"
                             aria-valuemax="100"></div>
                    </div>
                    <span>下載量 : 147,254 / 257,246</span>
                </div>
                <img src="../assets/download.png" class="w-auto h-52" alt="">
                <img src="../assets/upload.png" class="w-auto h-52" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Download"
    }
</script>

<style scoped>
    .root{
        height: calc(100vh - 4.4rem);
    }
</style>