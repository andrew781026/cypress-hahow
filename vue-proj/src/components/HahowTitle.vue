<template>
    <div class="d-flex w-100 h-44 border-bottom border-top border-dark">
        <div class="cursor-pointer col-1 d-flex align-items-center border-right border-dark"
             @click="link('GetSystemInfo')">
            退出
        </div>
        <div class="nav-title-text cursor-pointer col bg-youtube d-flex align-items-center border-right border-dark"
             @click="link('YoutubeSetting')">
            <img class="mr-2" src="../assets/youtube-icon.png" alt="youtube-icon" width="40px">
            設定 Youtube
        </div>
        <div class="nav-title-text cursor-pointer col bg-hahow d-flex align-items-center border-right border-dark"
             @click="link('HahowSetting')">
            <img class="mr-2" src="../assets/hahow-icon.png" alt="hahow-icon" width="40px">
            設定 Hahow
        </div>
        <div class="nav-title-text cursor-pointer col bg-course d-flex border-right border-dark align-items-center" @click="link('Course')">
            <img class="mr-2" src="../assets/training.png" alt="course-icon" width="40px">
            我的課程
        </div>
        <div class="nav-title-text cursor-pointer col bg-download d-flex align-items-center" @click="link('Download')">
            <img class="mr-2" src="../assets/direct-download.png" alt="download-icon" width="40px">
            下載與上傳管理
        </div>
    </div>
</template>

<script>
    export default {
        name: "HahowTitle",
        methods: {
            link(name) {
                this.$router.push({name});
            }
        },
    }
</script>

<style scoped lang="scss">

    .h-44 {
        height: 4.4rem;
    }

    .nav-title-text{
        font-weight: 900;
        font-size: 20px;
        color: aliceblue;
    }

    .bg-youtube {

        background-color: #ff3232;

        &:hover {
            background-color: #e70404;
        }

        &:active {
            background-color: #cc0000;
        }
    }

    .bg-hahow {

        background-color: #00D4A7;

        &:hover {
            background-color: #00c098;
        }

        &:active {
            background-color: #00ad88;
        }
    }

    .bg-course {

        background-color: #fbbd60;

        &:hover {
            background-color: #faad39;
        }

        &:active {
            background-color: #e19b33;
        }
    }

    .bg-download {

        background-color: #3b99ff;

        &:hover {
            background-color: #007bff;
        }

        &:active {
            background-color: #0068d8;
        }
    }

</style>