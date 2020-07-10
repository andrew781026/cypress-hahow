<template>
    <div class="mask" v-if="showMask">
        <!-- 參考資料 : https://projects.lukehaas.me/css-loaders/ -->
        <div class="loader">Loading...</div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "LoadingMask",
        computed: {
            ...mapGetters({
                showMask: '[GLOBAL] getLoadingBlockOpen',
            }),
        }
    }
</script>

<style scoped>

    .mask {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        left: 0;
        top: 0;
        min-height: 100%;
        min-width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10000;
    }

    .loader,
    .loader:after {
        border-radius: 50%;
        width: 10em;
        height: 10em;
    }

    .loader {
        margin: 60px auto;
        font-size: 10px;
        position: relative;
        text-indent: -9999em;
        border-top: 1.1em solid rgba(255, 255, 255, 0.2);
        border-right: 1.1em solid rgba(255, 255, 255, 0.2);
        border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
        border-left: 1.1em solid #ffffff;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation: load8 1.1s infinite linear;
        animation: load8 1.1s infinite linear;
    }

    @-webkit-keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }


</style>
