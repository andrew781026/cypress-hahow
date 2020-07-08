<template>
    <div>
        <button type="button" class="btn btn-primary" @click="console.log('good')">取得我的課程</button>
        <div class="relative">
            <!-- 課程圖片 -->
            <img class="author-avatar" src="../assets/course/author-avatar.png" alt="author-avatar">
            <img src="../assets/course/course-image.png" alt="course-img">
            <div class="ribbon">上課囉</div>
            <h2>全民防疫通識課：陳建仁副總統</h2>
            <div class="progress-bar w-256" role="progressbar"
                 aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
            <img src="" alt="smile">
            <div class="flex justify-between">
                <span>上課 14%</span>
                <span>尚未評價</span>
            </div>
            <div class="flex justify-between">
                <span>作業 0%</span>
                <span>*****</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Courses"
    }
</script>

<style scoped>

    .ribbon{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #00c098;
        overflow: hidden;
        transform: rotate(45deg);
    }

    .author-avatar {
        position: absolute;
        left: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 5px solid white;
        box-shadow: 0 2px 4px 0 black;/* the outer black line */
    }
</style>