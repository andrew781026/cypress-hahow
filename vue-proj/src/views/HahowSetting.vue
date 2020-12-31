<template>
    <div class="d-flex flex-column justify-content-center align-content-center p-16">
        <template v-if="isEditMode">
            <h3>請輸入您的 Hahow API KEY</h3>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">API KEY</span>
                </div>
                <input v-focus v-model="apiKey" type="text" class="form-control"
                       @keypress.enter="save" placeholder="Enter Your Hahow API KEY"/>
            </div>
        </template>
        <div class="mb-8" v-else>
            <h3>已儲存的 Hahow API KEY 是</h3>
            <div class="text-yellow break-words bg-black rounded-6 p-8 mt-2">
                {{hahowToken}}
            </div>
        </div>
        <div class="mb-8">
            <template v-if="isEditMode">
                <button type="button" class="btn btn-primary mr-8" :disabled="!apiKey" @click="save">
                    儲存
                </button>
                <button type="button" class="btn btn-secondary" :disabled="!apiKey" @click="apiKey = ''">
                    清除
                </button>
            </template>
            <button v-else type="button" class="btn btn-primary mr-8" @click="changeToEditMode">
                修改 API_KEY
            </button>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "HahowSetting",
        computed: {
            ...mapGetters({
                hahowToken: '[GLOBAL] getHahowToken',
            }),
        },
        created() {

            if (this.hahowToken) {

                this.apiKey = this.hahowToken;
                this.isEditMode = !(this.hahowToken);
            }
        },
        methods: {
            ...mapActions({
                setHahowToken: '[MAIN] SET_HAHOW_TOKEN',
            }),
            save() {

                window.ipcRenderer.invoke('save-hahowToken', this.apiKey)
                    .then(() => {

                        this.setHahowToken(this.apiKey);
                        this.apiKey = '';
                        this.isEditMode = false;
                    })
                    .catch(err => console.error(err))
            },
            openAuthUrl() {

                const hahowGoogleAuthUrl = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?response_type=code&client_id=686661032339-64490m7cjjftj9hca9i48ri5g3ohf0p2.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fhahow.in%2Fauth%2Fredirect&scope=openid%20profile%20email&display=popup&flowName=GeneralOAuthFlow';
                window.ipcRenderer.send('open-url', hahowGoogleAuthUrl);
            },
            changeToEditMode() {

                this.isEditMode = true;
            }
        },
        data() {

            // 下方設定預設值
            return {
                apiKey: this.hahowToken,
                isEditMode: false,
            }
        },
    }
</script>

<style scoped>

</style>