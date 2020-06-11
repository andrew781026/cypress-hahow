<template>
    <first/>
</template>

<script>
    import First from "./views/First";

    export default {
        name: 'App',
        components: {
            'first': First
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
    }

</style>
