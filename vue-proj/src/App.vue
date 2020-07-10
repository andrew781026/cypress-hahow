<template>
    <div id="app">
        <hahow-title/>
        <loading-mask/>
        <vue-page-transition name="fade-in-left">
            <router-view/>
        </vue-page-transition>
    </div>
</template>

<script>
    import HahowTitle from './components/HahowTitle';
    import LoadingMask from './components/LoadingMask';
    import {mapActions} from 'vuex';

    export default {
        name: 'App',
        components: {
            'hahow-title': HahowTitle,
            'loading-mask': LoadingMask,
        },
        methods: {
            ...mapActions({
                setInitData: '[MAIN] SET_INIT_DATA',
            }),
        },
        mounted() {

            // TODO 需要製作網路異常的 message box => 可用 web-socket 檢查連線是否正常
            window.ipcRenderer.invoke('connect-to-json-db')
                .then(() => window.ipcRenderer.invoke('get-json-db-all-info'))
                .then(this.setInitData)
                .catch(err => console.error(err));
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
