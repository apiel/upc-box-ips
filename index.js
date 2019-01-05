const puppeteer = require('puppeteer');
const fs = require('fs');

const { password } = require('./config');

async function start() {
    const executablePath = '/usr/bin/chromium-browser';
    const browser = await puppeteer.launch({ executablePath });
    const page = await browser.newPage();
    await page.goto('http://192.168.0.1/common_page/login.html', {waitUntil: 'networkidle0'});

    await page.waitFor('input[name=loginPassword]');
    await page.type('input[name=loginPassword]', password);
    console.log('password typed');
    await page.screenshot({ path: 'screenshots0.png' });

    await page.type('input[name=loginPassword]', String.fromCharCode(13));
    console.log('enter pressed');

    await page.waitFor(10000);
    // await page.waitForNavigation( { waitUntil : 'networkidle0' } );
 
    console.log('login done, we are now to home page');
    await page.screenshot({ path: 'screenshots1.png' });

    console.log('click to see connected devices');
    // await page.click('a[name="common_page/DeviceConnectionStatus"]'); // for some reason this not working on rpi
    // await page.evaluate(() => goto('common_page/DeviceConnectionStatus.html', 'content')); // this is not working in pupperteer and console browser
    await page.evaluate(() => {
      const a = document.querySelector('a[name="common_page/DeviceConnectionStatus"]');
      a.click();
    });
    // await page.waitForSelector('#deviceTable');

    await page.waitFor(2000);
    // await page.waitFor(10000);
    console.log('devices list is there');
    await page.screenshot({ path: 'screenshots2.png' });

    const devices = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll('#lanUsers-tbody tr[name=clientinfo]'));
      return trs.map(tr => {
        const tds = Array.from(tr.querySelectorAll('td'));
        const [ name, mac, ip, speed, wifi ] = tds.map(td => td.innerText);
        return { name, mac, ip, speed, wifi };
      });
    });
    console.log('devices', devices);
    fs.writeFileSync('devices.json', JSON.stringify(devices, null, 4));

    browser.close();

    setTimeout(start, 60000);
}

start();