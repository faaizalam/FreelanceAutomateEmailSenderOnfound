import clipboardy from 'clipboardy';
import mailgun from 'mailgun-js';
import { delay } from './delay.js';
import { html } from './HTML.js';
import nodemailer from "nodemailer"


let dateCreated = ""
let TokenAddress = ""
const transporter = nodemailer.createTransport({
    service:'gmail',
     // Set to true if you're using a secure connection (TLS/SSL)
    auth: {
      user: 'usamaalam1999@gmail.com', // Your Mailgun SMTP username
      // pass: 'xtrubbpzhwtmltmp' // Your Mailgun SMTP password
    }
  });

  
// const DOMAIN = "sandbox828146cec7164b8793950fd10f6055d6.mailgun.org";

// const Mailgun = require('mailgun.js');


// const mg = mailgun({
    
//     apiKey: "key-5ee5bc3829aaf14a0cfb6528ace1e720",
//     domain: DOMAIN,
// });


let times=0;
export const openWebsite = async (page, url) => {
    try {
        await page.setDefaultNavigationTimeout(50000)
        while (true) {
        page.goto(url);
         
        await page.waitForNavigation();
        await delay(5000)
            await copyAllAddressesOneByOne(page);
            times++
            console.log("working numbers",times)
        }


    }
    catch (e) {
        console.log(`error at openWebsite function: ${e.message}`);
    }
}

const coinUrls = async (page) => {
    try {
        await delay(5000)
        const hrefValues = await page.$$eval('a.ds-dex-table-row.ds-dex-table-row-top', (anchors) => {
            return anchors.map((anchor) => anchor.href);
        });
        return hrefValues;
    }
    catch (e) {
        console.log(`error at coinUrls function: ${e.message}`)
    }
}

const tokenSniffer = async (page, address) => {
    try {
        await page.setDefaultNavigationTimeout(50000)
        console.log("i am there",address)
        await page.goto('https://tokensniffer.com/');
        
        await delay(3000)
        let exits=true
        try {
            while (exits) {
                 exits=await page.evaluate(()=>{
                         const check= document.querySelector('.Home_searchInput__1uxZk')===null
                        return check;
        
                    })

                    await delay(2000)
                    console.log("while is running again",exits)
        }
            
        } catch (error) {
            console.log("error from token while",error.message)
        }
        await page.type('.Home_searchInput__1uxZk',address)
        console.log("started waiting")
        await delay(3000)
        console.log("finished 4 sec waiting")
       const input =await page.evaluate((address,page) => {
           
        //    const inputs= document.querySelector(".Home_searchInput__1uxZk").value=`${address}`
           const inputvalu= document.querySelector(".Home_searchResultNull__2esDQ")!==null
               console.log(inputvalu)
            return inputvalu
           
           
        },address,page);
        console.log(input)
        if(input){
            console.log("not found")
            return
        }else{
          
            await page.click(".Home_searchResult__3ZKTW")
            await page.waitForNavigation({timeout:80000})
            await delay(3000)
            // console.log("will wait for 5 sec")
            await page.waitForSelector("#__next > div > main > div.Home_content__2fqOz > div:nth-child(4) > div:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(1) > td > h2 > span",{timeout:7000,visible:true})
           const score= await page.evaluate(()=>{
               const scorediv= document.querySelector("#__next > div > main > div.Home_content__2fqOz > div:nth-child(4) > div:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(1) > td > h2 > span")
                const score =scorediv.innerText
                return score

            })

            await delay(3000)
            const scoregetting=score.split('/')
            console.log(scoregetting)
            if (scoregetting[0]>=0) {
                await Emailsending(scoregetting[0])
                
            }
        }
        
    
    }
    catch (e) {
        console.log(`error at tokenSniffer (the warning token has been hacked,scamed...): ${e.message}`);
    }
}

export const extractAddressAndPairDate = async (page) => {
    try {
        await page.waitForTimeout(5000);
        await page.waitForSelector(
            '#root > div > main > div > div > div.custom-1a9gxwe > div > div > div.custom-tb6agv > div > div.chakra-stack.custom-1lwqwrq > h2 > span.chakra-text.custom-fhd7ki',
            {
                timeout: 50000,
                visible: true
            });
        await page.click(
            '#root > div > main > div > div > div.custom-1a9gxwe > div > div > div.custom-tb6agv > div > div.chakra-stack.custom-1lwqwrq > h2 > span.chakra-text.custom-fhd7ki'
        );
        console.log("address copied");
        TokenAddress = await clipboardy.read();
        console.log('Copied text:', TokenAddress);
        await page.waitForSelector(
            '#root > div > main > div > div > div.custom-1a9gxwe > div > div > div.custom-1x6jrja > div > div.chakra-stack.custom-1udubt3 > span.chakra-text.custom-2ygcmq',
            {
                timeout: 50000,
                visible: true
            });
        dateCreated = await page.$eval('#root > div > main > div > div > div.custom-1a9gxwe > div > div > div.custom-1x6jrja > div > div.chakra-stack.custom-1udubt3 > span.chakra-text.custom-2ygcmq', (el) => el.innerText);
        console.log("date created: ", dateCreated)

        await tokenSniffer(page, TokenAddress);
    }
    catch (e) {
        console.log(`error at extractAddress function: ${e.message}`)
    }
}

const copyAllAddressesOneByOne = async (page) => {

    const urlArray = await coinUrls(page);
    urlArray.splice(0,2)
    console.log(urlArray)
    for (const url of urlArray) {
        page.goto(url);
        await extractAddressAndPairDate(page);
        await page.waitForTimeout(5000)
    }
}



const Emailsending = async (score) => {
    const mailOptions = {
        from: 'Sender Name <faaiz@100gmail>',
        to: ['usamaalam1999@gmail.com','faaiz.13527@iqra.edu.pk'],
        subject: 'Test Email',
        html:html(score,dateCreated,TokenAddress)
      };
    
  
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
        } else {
          console.log('Email sent successfully!');
          console.log('Message ID:', info.messageId);
        }
      });

   await delay(3000)

}
