<template>
    <div id="app">
        <input type="text" v-model="text" @keypress.enter="save"/>
        <button @click="save">儲存文字</button>
    </div>
</template>

<script>

    export default {
        name: 'App',
        methods: {
            save() {

                // call the registered listener
                window.registerFuncs.appendText(this.text);
                this.text = '';
            },
        },
        data() {

            return {
                text: null
            }
        }
    }
</script>

<style>

    body {
        margin: 0;
    }

    #app {
        font-family: '微軟正黑體', Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
