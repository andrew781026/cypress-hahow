<template>
  <div class="flex flex-col justify-center p-16">
    <h1>我是 <HahowManager/> 的作者 Tree</h1>
    <h3>緣起</h3>
    <span>為何會製作 <HahowManager/> 這個開源專案呢 ?</span>
    <span>最近工作常常在捷運上東奔西跑 , 4G 網路訊號很不穩定 , 因此希望能先將已購買的課程影片先下載下來 , </span>
    <span>之後就可以在離線狀態下學習了 😀</span>
    <div class="callout callout-primary">
      <h4>目前 <HahowManager/> 這個開源專案 , 非常缺人手幫忙</h4>
      <span>如果您想要幫忙 <HahowManager/> 測試 . 設計 . 開發 . 功能需求 ,
      <a href="https://github.com/andrew781026/cypress-hahow">歡迎到 Github 上發 issue 告知我 😀</a>
    </span>
    </div>
  </div>
</template>

<script>
import HahowManager from "../components/HahowManager";
export default {
  name: "About",
  components: {HahowManager}
}
</script>

<style scoped>
h3 {
  margin-top: 50px;
  width: 70px;
  border-bottom: 4px solid black;
}

span {
  margin: 10px 0;
}

.callout{
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #eee;
  border-left-width: 5px;
  border-radius: 6px;
}

.callout-primary {
  border-left-color: #428bca;
  background-color: #d9e7f4;
}
.callout-primary h4 {
  color: #428bca;
}
</style>