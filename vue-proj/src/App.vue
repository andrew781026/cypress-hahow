<template>
    <div id="app">
        <button v-if="$router.history.current.name !== 'Home'" @click="$router.back()">
            返回上一頁
        </button>
        <router-view/>
    </div>
</template>

<script>

    export default {
        name: 'App',
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
        font-family: '微軟正黑體', Avenir, Helvetica, Arial, sans-serif, -apple-system, BlinkMacSystemFont;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

</style>
