<template>
    <div class="flex w-100 h-44 border-bottom border-top border-dark">
        <template v-if="router.history.current.name === 'Download'">
            <div class="flex justify-center items-center back-arrow" @click="router.back()">
                <img class="mr-2 w-24" src="../assets/back-arrow.png" alt="back-arrow">
            </div>
            <div class="flex items-center">
                <h3>{{getTitle()}}</h3>
            </div>
        </template>
        <template v-else>
            <div class="px-12 justify-center flex items-center border-right border-dark click-bigger"
                 @click="link('GetSystemInfo')">
                <span>退出</span>
            </div>
            <div class="nav-title-text bg-youtube click-bigger"
                 @click="link('YoutubeSetting')">
                <img class="mr-2 w-24" src="../assets/youtube-icon.png" alt="youtube-icon">
                設定 Youtube
            </div>
            <div class="nav-title-text bg-hahow click-bigger"
                 @click="link('HahowSetting')">
                <img class="mr-2 w-24" src="../assets/hahow-icon.png" alt="hahow-icon">
                設定 Hahow
            </div>
            <div class="nav-title-text bg-course click-bigger" @click="link('Course')">
                <img class="mr-2 w-24" src="../assets/training.png" alt="course-icon">
                我的課程
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: "HahowTitle",
        methods: {
            link(name) {
                this.$router.push({name});
            },
            getTitle(){
                return document.title;
            }
        },
        watch: {
            $router(value) {
                this.router = value
            }
        },
        data() {

            return {
                router: this.$router
            }
        }
    }
</script>

<style scoped lang="scss">

    .back-arrow {

        margin: 5px;
        border-radius: 50%;
        width: 55px;
        height: 55px;
        transition: background-color 0.5s;

        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }

    .h-44 {
        height: 4.4rem;
    }

    .nav-title-text {
        user-select: none;
        font-weight: 900;
        font-size: 20px;
        color: aliceblue;
        cursor: pointer;
        display: flex;
        align-items: center;
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 0;
        border-right: 1px solid #343a40;
        padding-left: 16px;
    }

    .click-bigger:active {
        transform: scale(1.1);

      &:first-child{
        transform-origin: top left;
      }

      &:last-child{
        transform-origin: top right;
      }
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