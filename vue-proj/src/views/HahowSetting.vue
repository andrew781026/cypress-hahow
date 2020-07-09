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
            <button type="button" class="btn btn-primary mr-8" @click="save">儲存</button>
            <button type="button" class="btn btn-secondary" @click="apiKey = ''">清除</button>
        </div>
        <div>
            已儲存的 Hahow API KEY 是 <span class="text-orange-light break-words">{{$store.state.hahowToken}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HahowSetting",
        methods: {
            save() {

                window.ipcRenderer.invoke('save-hahowToken',this.apiKey)
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