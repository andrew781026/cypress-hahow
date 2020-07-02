<template>
    <div class="d-flex w-100 h-44 border-bottom border-top border-dark">
        <div class="col-1 d-flex align-items-center border-right border-dark" @click="link('GetSystemInfo')">
            退出
        </div>
        <div class="col bg-primary d-flex align-items-center border-right border-dark" @click="link('YoutubeSetting')">
            設定 Youtube Token
        </div>
        <div class="col bg-info d-flex align-items-center border-right border-dark" @click="link('HahowSetting')">
            設定 Hahow Token
        </div>
        <div class="col bg-success d-flex align-items-center" @click="link('Download')">
            下載與上傳管理
        </div>
    </div>
</template>

<script>
    export default {
        name: "HahowTitle",
        methods: {
            link(name) {
                this.$router.push({name});
            }
        },
    }
</script>

<style scoped>

    .h-44 {
        height: 4.4rem;
    }
</style>