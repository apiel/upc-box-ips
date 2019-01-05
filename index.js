const puppeteer = require('puppeteer');
const { password } = require('./config');

(async() => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://192.168.0.1/common_page/login.html', {waitUntil: 'networkidle0'});

    await page.waitFor('input[name=loginPassword]');
    await page.type('input[name=loginPassword]', password);
    console.log('password typed');
    await page.screenshot({ path: 'screenshots0.png' });

    await page.type('input[name=loginPassword]', String.fromCharCode(13));
    console.log('enter pressed');

    await page.waitForNavigation( { waitUntil : 'networkidle0' } );
    console.log('login done, we are now to home page');
    await page.screenshot({ path: 'screenshots1.png' });


    console.log('click to see connected devices');
    await page.click('a[name="common_page/DeviceConnectionStatus"]');
    // await page.waitFor(2000);

    await page.waitForSelector('#deviceTable');

    await page.waitFor(2000);
    console.log('devices list is there');
    await page.screenshot({ path: 'screenshots2.png' });

    // // Extract the results from the page
    // const links = await page.evaluate(() => {
    //   const anchors = Array.from(document.querySelectorAll('.result-link a'));
    //   return anchors.map(anchor => anchor.textContent);
    // });
    // console.log(links.join('\n'));

    browser.close();

})();