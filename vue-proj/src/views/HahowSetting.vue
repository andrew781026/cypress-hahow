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