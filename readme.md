# Hahow 影片取得

取得 Hahow 的影片與字幕 ( 利用 Hahow API ) ,  
之後可批次上傳到私人 youtube ,  
製作 youtube 撥放清單 ,  
然後在 APP 中進行觀看  

## 桌面 APP 

目前完整 Electron App 在 vue-proj 資料夾中 

可用 `electron:serve` 開啟

截圖 

![設定 hahow api_key](https://i.imgur.com/NSBoLfg.png)

![個人課程列表](https://i.imgur.com/nWLQsoD.png)

![課程內容](https://i.imgur.com/cfbvsuq.png)


## 里程碑

1. 利用 hahow restful api 取得影片 URL => 完成
2. 下載影片到筆電中 => 完成
3. 上傳到私人 youtube 的撥放清單
4. 追加字幕

## 其他可學習 

- loadtest : 練習網站壓力測試

https://blog.typeart.cc/using-puppeteer-crawler-common-skills/

如果要處理印表機功能 - https://www.npmjs.com/package/node-thermal-printer

[Electron: 截獲 <webview> will-navigate 事件, 為內容來源實作白名單](https://medium.com/cow-say/electron-%E6%88%AA%E7%8D%B2-webview-will-navigate-%E4%BA%8B%E4%BB%B6-%E7%82%BA%E5%85%A7%E5%AE%B9%E4%BE%86%E6%BA%90%E5%AF%A6%E4%BD%9C%E7%99%BD%E5%90%8D%E5%96%AE-b31abb35d2c7)

## 好用的套件 

### 將 .mp4 轉成 .gif
- [Converting Android Videos to Animated GIF Images With Cloudinary: A Tutorial](https://cloudinary.com/blog/converting_android_videos_to_animated_gif_images_with_cloudinary_a_tutorial)
- [gifify](https://www.npmjs.com/package/gifify)
- [node-canvas](https://www.npmjs.com/package/canvas)

### [Tmp](https://www.npmjs.com/package/tmp)
A simple temporary file and directory creator for node.js.

- 設定 electron & vue - https://juejin.im/post/5d1abff7f265da1bb80c47e3
- [想要试试Electron ，不如看看这篇爬坑总结](https://juejin.im/post/5ede23c6e51d45783f11023d)
