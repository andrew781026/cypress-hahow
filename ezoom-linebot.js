const puppeteer = require('puppeteer');
const {ezoomAuth} = require('./pass');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('http://localhost:8001/');
    await page.waitForSelector('#login-btn'); // wait button init
    await page.type('#employeeId', ezoomAuth.employeeId);
    await page.type('#password', ezoomAuth.password);
    await page.click('#login-btn');

    // await browser.close();
})();
