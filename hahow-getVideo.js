const url = 'https://hahow.in/courses/586fae97a8aae907000ce721/discussions?item=5a1e1755a2c4b000589dda2c';

const puppeteer = require('puppeteer');
const {user} = require('./pass');

const email = user.email;
const password = user.password;

// to refresh smsCode : https://accounts.google.com/signin/v2/sl/pwd?service=accountsettings&passive=1209600&osid=1&continue=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Ftwo-step-verification%3Frfr%3Dsem&followup=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Ftwo-step-verification%3Frfr%3Dsem&rart=ANgoxcekNOGO-0mSsOtSfshBcpp-oiubST_eqqL3tA2N-5iOjoDXtxpdTTy2kEhewG53dpe98Wj-HBSjHxQ9QQeK7gqDgVk01A&authuser=0&csig=AF-SEnYPjEQ1hfrgq2Ef%3A1589955335&flowName=GlifWebSignIn&flowEntry=ServiceLogin
const smsCode = user.smsCode[7];
const videoUrls = [];

const googleLoginWithBackupCode = async ({browser, email, password, smsCode}) => {

    // 參考資料 : https://stackoverflow.com/questions/48773255/trouble-logging-in-to-google-with-headless-chrome-puppeteer#answer-55203273
    // wait for the google oauth page to open
    const googleOAuthTarget = await browser.waitForTarget(target => {
        // console.log( target.url() ); // debugging
        return target.url().indexOf('https://accounts.google.com/signin/oauth/identifier') !== -1
    });

    const googleOAuthPage = await googleOAuthTarget.page();

    // 輸入帳號
    await googleOAuthPage.waitForSelector('#identifierId');
    await googleOAuthPage.type('#identifierId', email, {delay: 5});
    await googleOAuthPage.click('#identifierNext');

    // 輸入密碼
    await googleOAuthPage.waitForSelector('input[type="password"]', {visible: true});
    await googleOAuthPage.type('input[type="password"]', password);
    await googleOAuthPage.click('#passwordNext');

    // 按鈕 : 其他方式
    await googleOAuthPage.waitForSelector('div[role="button"]:not(#idvPreregisteredPhoneNext):not(.x95qze)');
    await googleOAuthPage.waitFor(3000);  // 等 2 秒
    await googleOAuthPage.click('div[role="button"]:not(#idvPreregisteredPhoneNext):not(.x95qze)');

    // 按鈕 : 使用備用碼
    await googleOAuthPage.waitForSelector('div[role="link"][data-challengetype="8"]');
    await googleOAuthPage.waitFor(1000);  // 等 1 秒
    await googleOAuthPage.click('div[role="link"][data-challengetype="8"]');

    // 輸入備用碼
    await googleOAuthPage.waitForSelector('input[type="tel"]', {visible: true});
    await googleOAuthPage.type('input[type="tel"]', smsCode);
    await googleOAuthPage.waitFor(2000);  // 等 2 秒
    await googleOAuthPage.click('#backupCodeNext');

};

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitFor('button.google'); // wait button .google init
    await page.click('button.google'); // wait button .google init

    // 利用 備用碼 做 google 兩步驟驗證的登入
    await googleLoginWithBackupCode({browser, email, password, smsCode});

    page.setRequestInterception(true);
    page.on('request', (request) => {
        if (request.resourceType() === 'media') {

            // videoUrls.push(request.url()); // collect the url and download the mp4
            console.log(request.url());

            // TODO save the video from url

            /*
            * We get the below Urls
            * https://player.vimeo.com/external/259601992.sd.mp4?s=246afbf015d2e21d45095b1c19d4d2448fe9acc5&time=939
              https://vod-progressive.akamaized.net/exp=1589967368~acl=%2A%2F953736259.mp4%2A~hmac=164beb8ab3c73c565775f8618a52fb45b2c817ba4e48d13b711c70e69ac5bf4c/vimeo-prod-skyfire-std-us/01/1920/10/259601992/953736259.mp4
              https://player.vimeo.com/external/259601992.sd.mp4?s=246afbf015d2e21d45095b1c19d4d2448fe9acc5&time=393
              https://vod-progressive.akamaized.net/exp=1589967370~acl=%2A%2F953736259.mp4%2A~hmac=9e1f6dde0f457ebe9de55ad5bc0ce0756a171f2371cb3d303cc9f0becd448e2f/vimeo-prod-skyfire-std-us/01/1920/10/259601992/953736259.mp4
            * */
        }
        request.continue();
    });

    await page.waitForSelector('a[href="/notifications"]');
    await page.waitFor(3000); // 等 3 秒
    const containerHandle = await page.$("#container > ul");
    const links = await page.evaluate(el => el.innerHTML, containerHandle);

    // 下載 html 後 , 用 cheerio 做分析
    console.log('containerHandle=', containerHandle);
    console.log('videoUrls=', videoUrls);
    console.log('links=', links);

    await page.screenshot({path: 'img/news.png', fullPage: true});

    // await browser.close();
})();
