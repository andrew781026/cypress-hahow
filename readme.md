# Hahow 影片取得

取得 Hahow 的影片與字幕 ( 利用 Hahow API ) ,  
之後可批次上傳到私人 youtube ,  
製作 youtube 撥放清單 ,  
然後在 APP 中進行觀看  

## 桌面 APP 

目前完整 Electron App 在 vue-proj 資料夾中 

可用 `electron:serve` 開啟

截圖 

![](https://i.imgur.com/NSBoLfg.png)

![](https://i.imgur.com/nWLQsoD.png)

![](https://i.imgur.com/cfbvsuq.png)


## 里程碑

1. 利用 hahow restful api 取得影片 URL => 完成
2. 下載影片到筆電中 => 完成
3. 上傳到私人 youtube 的撥放清單
4. 追加字幕

## 其他可學習 

- loadtest : 練習網站壓力測試

https://blog.typeart.cc/using-puppeteer-crawler-common-skills/

如果要處理印表機功能 - https://www.npmjs.com/package/node-thermal-printer

## 好用的套件 

### [Tmp](https://www.npmjs.com/package/tmp)
A simple temporary file and directory creator for node.js.

- 設定 electron & vue - https://juejin.im/post/5d1abff7f265da1bb80c47e3
- [想要试试Electron ，不如看看这篇爬坑总结](https://juejin.im/post/5ede23c6e51d45783f11023d)
