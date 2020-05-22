const host = 'https://hahow.in';
const href = '/courses/586fae97a8aae907000ce721/discussions?item=5a1e1755a2c4b000589dda2c';
const url = host + href;

const puppeteer = require('puppeteer');
const {user} = require('../pass');
const getClassList = require('./getClassList');
const myEmitter = require('./eventHook');

const email = user.email;
const password = user.password;

// to refresh smsCode : https://accounts.google.com/signin/v2/sl/pwd?service=accountsettings&passive=1209600&osid=1&continue=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Ftwo-step-verification%3Frfr%3Dsem&followup=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Ftwo-step-verification%3Frfr%3Dsem&rart=ANgoxcekNOGO-0mSsOtSfshBcpp-oiubST_eqqL3tA2N-5iOjoDXtxpdTTy2kEhewG53dpe98Wj-HBSjHxQ9QQeK7gqDgVk01A&authuser=0&csig=AF-SEnYPjEQ1hfrgq2Ef%3A1589955335&flowName=GlifWebSignIn&flowEntry=ServiceLogin
const smsCode = user.smsCode[0];

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
    if (await googleOAuthPage.$('div[role="button"]:not(#idvPreregisteredPhoneNext):not(.x95qze)') !== null) {

        await googleOAuthPage.click('div[role="button"]:not(#idvPreregisteredPhoneNext):not(.x95qze)');

    } else await googleOAuthPage.click('button#assistiveActionOutOfQuota');

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

// 取得課程列表
const getClasses = async ({browser, page}) => {

    await page.goto(url);
    await page.waitFor('button.google'); // wait button .google init
    await page.click('button.google'); // wait button .google init

    // 利用 備用碼 做 google 兩步驟驗證的登入
    await googleLoginWithBackupCode({browser, email, password, smsCode});

    await page.waitForSelector('a[href="/notifications"]'); // 等待小鈴鐺小圖示出現
    await page.waitFor(3000); // 等 3 秒
    const container = await page.$eval("#container > ul", el => el.innerHTML);

    return getClassList(container);
};

(async () => {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    const classList = await getClasses({browser, page});

    const attachEventsOn = async (page) => {

        await page.setRequestInterception(true);

        // register a request listener to page
        page.on('request', request => {

            if (request.resourceType() === 'media') {

                videoUrl = request.url();
                console.log('in request , videoUrl=', videoUrl); // 因為 video 會 request 4 次 , 所以 4 次後 才 goto ?

                myEmitter.emit('appendUrl', {videoUrl}); // addpendUrl and go on next page
            }
            request.continue();
        });

        page.on('domcontentloaded', () => {

            console.log('in domcontentloaded,');
            // here we can put page goto next
            myEmitter.emit('response'); // addpendUrl and go on next page
        });
    };

    // register request event
    await attachEventsOn(page);

    // 需要使用 callback 的處理方式
    // => 先 goto 第一個 , 等到 request 後 , goto 下一個 ( 此時 request 需要停止 )

    let index = 0;
    const cb = () => {

        console.log('trigger callback !');
        const item = classList[++index];
        myEmitter.emit('addItem', {...item, cb});
        page.goto(host + item.href, {waitUntil: 'load'}).then().catch(e => console.error(e));
    };

    const item1 = classList[0];
    myEmitter.emit('addItem', {...item1, cb});
    await page.goto(host + item1.href, {waitUntil: 'load'}); // 執行一次 , 之後仰賴 callback 執行

    // await browser.close();
})();
