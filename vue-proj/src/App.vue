<template>
    <div id="app">
        <hahow-title/>
        <loading-mask/>
        <light-box :image="lightBoxInfo.imageUrl" :show="lightBoxInfo.show" @close="closeLightBox"/>
        <vue-page-transition name="fade-in-left">
            <router-view/>
        </vue-page-transition>
    </div>
</template>

<script>
    import HahowTitle from './components/HahowTitle';
    import LoadingMask from './components/LoadingMask';
    import LightBox from './components/LightBox';
    import {mapActions, mapGetters} from 'vuex';

    export default {
        name: 'App',
        components: {
            'hahow-title': HahowTitle,
            'loading-mask': LoadingMask,
            'light-box': LightBox,
        },
        computed: {
            ...mapGetters({
                lightBoxInfo: '[GLOBAL] getLightBoxInfo',
            }),
        },
        methods: {
            ...mapActions({
                setInitData: '[MAIN] SET_INIT_DATA',
                closeLightBox: '[MAIN] HIDE_LIGHT_BOX',
            }),
        },
        mounted() {

            // TODO 需要製作網路異常的 message box => 可用 web-socket 檢查連線是否正常
            window.ipcRenderer.invoke('connect-to-json-db')
                .then(() => window.ipcRenderer.invoke('get-json-db-all-info'))
                .then(this.setInitData)
                .catch(err => console.error(err));

            // window.registerFuncs.updateBadge(3);
            setTimeout(() => window.registerFuncs.updateBadge(3), 1000);
        }
    }
</script>

<style>

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
    }

    #app {
        font-family: '微軟正黑體', Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        min-height: 100vh;
    }
</style>
