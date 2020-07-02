<template>
    <div class="container px-0 mx-4">
        <div class="p-4 row">
            <input class="form-control col-4"  type="text" v-model="text" @keypress.enter="save"/>
            <button type="button" class="btn btn-primary mx-2" @click="save">儲存文字</button>
            <br>
            <button type="button" class="btn btn-primary" @click="getInfo">取得本機資訊</button>
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
        name: 'GetSystemInfo',
        methods: {
            save() {

                // call the registered listener
                window.registerFuncs.appendText(this.text);
                this.text = '';
            },
            getInfo() {

                window.ipcRenderer.send('call-getInfo');

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

<style scoped>
    .card {
        margin: 20px;
        padding: 10px;
        border-radius: 8px;
        background-color: aliceblue;
        box-shadow: 0 0 7px 3px rgba(0, 0, 0, 0.2);
    }
</style>
