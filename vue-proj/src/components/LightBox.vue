<template>
    <div class="lightbox-root" v-show="show"
         @click="$emit('close')">
        <img :src="image" alt="圖片">
    </div>
</template>

<script>

    export default {
        name: "LightBox",
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            image: {
                type: String,
                default: '',
            },
        },
        mounted() {
            this.listener = () => this.$emit('close');
            window.addEventListener('keydown', this.listener);
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.listener);
        }
    }
</script>

<style scoped>
    .lightbox-root {
        position: fixed;
        width: 100vw;
        height: 100vh;
        left: 0;
        top: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .lightbox-root > img {
        max-height: 90vh;
        max-width: 90vw;
    }
</style>