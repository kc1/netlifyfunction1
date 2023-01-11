const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function (event, context) {

    let browser = null;

    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
            headless: true,
            //   headless: chromium.headless,
            //   ignoreHTTPSErrors: true,
            // defaultViewport: chromium.defaultViewport,
        });
        browser.close();

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: 'OK'
            })
        }

    }
    catch (error) {
        console.log(error);
    }

}