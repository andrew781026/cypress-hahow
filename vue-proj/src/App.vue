<template>
    <div id="app">
        <div style="padding: 10px">
            <input style="margin-right: 5px" type="text" v-model="text" @keypress.enter="save"/>
            <button @click="save">儲存文字</button>
            <br>
            <button @click="getInfo">取得本機資訊</button>
            <br>
        </div>
        <div class="card" v-for="(local,index) in locals" :key="`local-${index}`">
            <p>名稱 : {{local.name}}</p>
            <p>IP 位置 : </p>
            <p style="margin-left: 10px"><span style="background-color: red;color: white">[ {{local.family}} ]</span> {{local.address}}</p>
            <p>MAC 地址 : {{local.mac}}</p>
        </div>
        <div class="card" v-for="(dns,index) in dnsArr" :key="`dns-${index}`">
            <p>DNS 伺服器 : {{dns}}</p>
        </div>
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
            getInfo() {

                // call the registered listener
                this.locals = window.registerFuncs.getIpInfo();
                this.dnsArr = window.registerFuncs.getDnsServers();
            },
        },
        data() {

            return {
                text: null,
                locals: [],
                dnsArr: [],
            }
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

    .card {
        margin: 20px;
        padding: 10px;
        border-radius: 8px;
        background-color: aliceblue;
        box-shadow: 0 0 7px 3px rgba(0, 0, 0, 0.2);
    }
</style>
