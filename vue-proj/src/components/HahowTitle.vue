<template>
  <div class="flex w-100 h-44 border-top border-bottom border-dark">
    <template v-if="currentRouteName === 'Download'">
      <div class="flex justify-center items-center back-arrow" @click="back">
        <img class="mr-2 w-24" src="../assets/back-arrow.png" alt="back-arrow">
      </div>
      <div class="flex items-center">
        <h3>{{ getTitle() }}</h3>
      </div>
    </template>
    <template v-else>
      <div class="nav-about-me click-bigger"
           @click="link('About')">
        <span>關於我</span>
      </div>
      <div class="nav-title-text flex-1 bg-youtube click-bigger"
           @click="link('YoutubeSetting')">
        <img class="mr-2 w-24" src="../assets/youtube-icon.png" alt="youtube-icon">
        設定 Youtube
      </div>
      <div class="nav-title-text flex-1 bg-hahow click-bigger"
           @click="link('HahowSetting')">
        <img class="mr-2 w-24" src="../assets/hahow-icon.png" alt="hahow-icon">
        設定 Hahow
      </div>
      <div class="nav-title-text flex-1 bg-course click-bigger" @click="link('Course')">
        <img class="mr-2 w-24" src="../assets/training.png" alt="course-icon">
        我的課程
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "HahowTitle",
  methods: {
    back() {
      this.$router.back();
    },
    link(name) {
      this.$router.push({name});
    },
    getTitle() {
      return document.title;
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  },
}
</script>

<style scoped lang="scss">

.back-arrow {

  margin: 5px;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  transition: background-color 0.5s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.h-44 {
  height: 4.4rem;
}

.nav-about-me {
  user-select: none;
  cursor: pointer;
  background-color: aliceblue;
  font-weight: 900;
  font-size: 20px;
  padding-left: 16px; // 1rem = 16px 1.2rem = 19.2px
  padding-right: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #343a40;
}

.nav-title-text {
  user-select: none;
  font-weight: 900;
  font-size: 20px;
  color: aliceblue;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-right: 1px solid #343a40;
  padding-left: 16px;
}

.click-bigger:active {
  transform: scale(1.1);
  border-bottom: 1px solid #343a40;
  border-left: 1px solid #343a40;

  &:first-child {
    transform-origin: top left;
  }

  &:last-child {
    transform-origin: top right;
  }
}

.bg-youtube {

  background-color: #ff3232;

  &:hover {
    background-color: #e70404;
  }

  &:active {
    background-color: #cc0000;
  }
}

.bg-hahow {

  background-color: #00D4A7;

  &:hover {
    background-color: #00c098;
  }

  &:active {
    background-color: #00ad88;
  }
}

.bg-course {

  background-color: #fbbd60;

  &:hover {
    background-color: #faad39;
  }

  &:active {
    background-color: #e19b33;
  }
}

.bg-download {

  background-color: #3b99ff;

  &:hover {
    background-color: #007bff;
  }

  &:active {
    background-color: #0068d8;
  }
}

</style>