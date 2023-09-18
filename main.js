import puppeter from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { openWebsite } from './function.js'
puppeter.use(StealthPlugin())
const puppeterdiplay = (async () => {
    const browser = await puppeter.launch({
        headless: false,
        defaultViewpageort: null,
        args: ["--start-maximized"],
        executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",
        userDataDir:"C:/Users/OK Computers/AppData/Local/Google/Chrome/User",
        
    })
    let page = await browser.newPage();
    await page.setViewport({
        width: 1400,
        height: 700,
        deviceScaleFactor: 2,
    });
    const dexScreenerUrl = 'https://dexscreener.com/ethereum/5m?rankBy=txns&order=desc&minLiq=1000&maxAge=1'
    await openWebsite(page, dexScreenerUrl);
    //browser close
    // await browser.close()
})
puppeterdiplay()


