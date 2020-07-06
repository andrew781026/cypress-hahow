<template>
    <div id="app">
        <hahow-title/>
        <router-view/>
    </div>
</template>

<script>
    import HahowTitle from './components/HahowTitle'

    export default {
        name: 'App',
        components: {
            'hahow-title': HahowTitle
        },
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
