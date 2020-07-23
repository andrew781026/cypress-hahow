<template>
    <div class="d-flex flex-column justify-content-center align-content-center p-16">
        <h3>請輸入您的 Google OAuth2 憑證</h3>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">CLIENT_ID</span>
            </div>
            <input id="clientId" v-model="clientId" type="text" class="form-control"
                   placeholder="Enter Your Google CLIENT_ID" @keypress.enter="next"/>
        </div>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon2">CLIENT_SECRET</span>
            </div>
            <input ref="clientSecret" id="clientSecret" v-model="clientSecret" type="text" class="form-control"
                   placeholder="Enter Your Google CLIENT_SECRET" @keypress.enter="save"/>
        </div>
        <div class="mb-8">
            <button type="button" class="btn btn-primary mr-8" :disabled="!(clientId || clientSecret)" @click="save">
                儲存
            </button>
            <button type="button" class="btn btn-secondary" :disabled="!(clientId || clientSecret)" @click="clear">
                清除
            </button>
        </div>
        <div>
            <button type="button" class="btn btn-primary mr-8" @click="login">取得 ACCESS_TOKEN</button>
        </div>
        <div v-if="accessToken">
            您的 Google ACCESS_TOKEN 是
            <div class="text-yellow break-words bg-black rounded-6 p-8 mt-2">
                {{accessToken}}
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "YoutubeSetting",
        computed: {
            ...mapGetters({
                accessToken: '[GLOBAL] getAccessToken',
            }),
        },
        methods: {
            ...mapActions({
                setGoogleTokens: '[MAIN] SET_GOOGLE_TOKENS',
            }),
            next() {

                this.$refs.clientSecret.focus();
            },
            save() {

                this.$store.state.google.clientId = this.clientId;
                this.$store.state.google.clientSecret = this.clientSecret;
                window.ipcRenderer.send('save-google-auth-info', {
                    clientId: this.clientId,
                    clientSecret: this.clientSecret
                });
                this.clear();
            },
            clear() {
                this.clientId = '';
                this.clientSecret = '';
            },
            login() {

                // 呼叫 Google 登入
                window.ipcRenderer.invoke('google-login', {
                    clientId: this.clientId,
                    clientSecret: this.clientSecret
                })
                    .then(tokens => this.setGoogleTokens(tokens))
                    .catch(err => console.error(err));
            }
        },
        data() {

            return {
                clientId: '',
                clientSecret: '',
            }
        },
    }
</script>

<style scoped>

</style>
