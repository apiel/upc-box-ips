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

    // const rows = await page.$$eval('table tr', row => {
    //     console.log('row.innerHTML', row.innerHTML);
    //     return row;
    // }); //#lanUsers-tbody tr.clientinfo
    // console.log('rows', rows);

    // // Extract the results from the page
    const rows = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll('#lanUsers-tbody tr[name=clientinfo]'));
      return trs.map(tr => {
        const tds = Array.from(tr.querySelectorAll('td'));
        return tds.map(td => td.innerText);
        // return tr.innerHTML;
      });
    });
    console.log('rows', rows);

    browser.close();

})();