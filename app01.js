const url = 'https://hahow.in/courses/586fae97a8aae907000ce721/discussions?item=5a1e1755a2c4b000589dda2c';

const puppeteer = require('puppeteer');
const {user} = require('./pass');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitFor('button.google'); // wait button .google init
    await page.click('button.google'); // wait button .google init
    // await page.screenshot({path: 'example.png'});

    // 參考資料 : https://stackoverflow.com/questions/48773255/trouble-logging-in-to-google-with-headless-chrome-puppeteer#answer-55203273
    // wait for the google oauth page to open
    const googleOAuthTarget = await browser.waitForTarget(target => {
        // console.log( target.url() ); // debugging
        return target.url().indexOf('https://accounts.google.com/signin/oauth/identifier') !== -1
    });

    const googleOAuthPage = await googleOAuthTarget.page();

    await googleOAuthPage.waitForSelector('#identifierId');
    await googleOAuthPage.type('#identifierId', user.email, {delay: 5});
    await googleOAuthPage.click('#identifierNext');

    await googleOAuthPage.waitForSelector('input[type="password"]', {visible: true});
    await googleOAuthPage.type('input[type="password"]', user.password);

    await googleOAuthPage.waitForSelector('#passwordNext', {visible: true});
    await googleOAuthPage.click('#passwordNext');

    await googleOAuthPage.waitForSelector('div.U26fgb.O0WRkf.oG5Srb.HQ8yf.C0oVfc.uRo0Xe.M9Bg4d[role="button"]'); // 等 1 秒
    await googleOAuthPage.click('div.U26fgb.O0WRkf.oG5Srb.HQ8yf.C0oVfc.uRo0Xe.M9Bg4d[role="button"]');

    await googleOAuthPage.waitForSelector('div.lCoei.YZVTmd.SmR8[role="link"][data-challengetype="8"]');  // 等 1 秒
    await googleOAuthPage.click('div.lCoei.YZVTmd.SmR8[role="link"][data-challengetype="8"]');

    await googleOAuthPage.waitForSelector('input[type="tel"]', {visible: true});
    await googleOAuthPage.type('input[type="tel"]', user.smsCode[0]);

    await googleOAuthPage.waitForSelector('#backupCodeNext', {visible: true});
    await googleOAuthPage.click('#backupCodeNext');

    // await browser.close();
})();
