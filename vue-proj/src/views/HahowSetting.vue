<template>
    <div class="d-flex flex-column justify-content-center align-content-center p-16">
        <h3>請輸入您的 Hahow API KEY</h3>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">API KEY</span>
            </div>
            <input v-model="apiKey" type="text" class="form-control" placeholder="Enter Your Hahow API KEY"
                   @keypress.enter="save"/>
        </div>
        <div class="mb-8">
            <button type="button" class="btn btn-primary mr-8" :disabled="!apiKey" @click="save">儲存</button>
            <button type="button" class="btn btn-secondary" :disabled="!apiKey" @click="apiKey = ''">清除</button>
        </div>
        <div>
            <button type="button" class="btn btn-primary mr-8" @click="openAuthUrl">開啟認證頁面</button>
        </div>
        <div v-if="$store.state.hahowToken">
            已儲存的 Hahow API KEY 是
            <div class="text-yellow break-words bg-black rounded-6 p-8 mt-2">
                {{$store.state.hahowToken}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HahowSetting",
        methods: {
            save() {

                window.ipcRenderer.invoke('save-hahowToken', this.apiKey)
                    .then(() => {

                        this.$store.state.hahowToken = this.apiKey;
                        window.ipcRenderer.invoke().then().catch();
                        this.apiKey = '';
                        console.log('this.$store.hahowToken=', this.$store.state.hahowToken);
                    })
                    .catch(err => console.error(err))
            },
            openAuthUrl() {

                const hahowGoogleAuthUrl = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?response_type=code&client_id=686661032339-64490m7cjjftj9hca9i48ri5g3ohf0p2.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fhahow.in%2Fauth%2Fredirect&scope=openid%20profile%20email&display=popup&flowName=GeneralOAuthFlow';
                window.ipcRenderer.send('open-url', hahowGoogleAuthUrl);
            }
        },
        data() {

            return {
                apiKey: '',
            }
        },
    }
</script>

<style scoped>

</style>