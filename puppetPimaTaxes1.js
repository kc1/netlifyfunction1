// const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

exports.handler = async function (event, context) {

  const body = JSON.parse(event.body); // postencoded
  // const apn = '110067270';
  const apn = body.apn;
  const verify = body.verify;
  console.log('starting ', apn);
  const data = await run6(apn, verify);
  console.log(data.Structure);
  let obj = {};
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: obj
    })
  }

}




async function buildURL(apn) {

  const scb = apn.slice(0, 3);
  const scm = apn.slice(3, 5);
  const scp = apn.slice(5);

  return `https://www.to.pima.gov/propertyInquiry/?stateCodeB=${scb}&stateCodeM=${scm}&stateCodeP=${scp}`;

}
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}

// async function run() {
exports.handler = async function (event, context) {

  const body = JSON.parse(event.body); // postencoded
  // const apn = '110067270';
  const apn = body.apn;
  console.log('starting ', apn);

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  // const url = await buildURL(apn);
  const url = "https://www.to.pima.gov/propertyInquiry/?stateCodeB=129&stateCodeM=05&stateCodeP=0070";

  await page.goto(url, { waitUntil: 'networkidle0' });
  await delay(2000);

  const data = await page.evaluate(() => {
    let headTHS = Array.from(document.querySelectorAll("#tblAcctBal > thead > tr > th"));
    let footTHS = Array.from(document.querySelectorAll("#tblAcctBal > tfoot > tr > th"));
    return { "headTHS": headTHS, "footTHS": footTHS }
  });
  // var ageList = document.querySelectorAll(`span.age`);
  //   // var scoreList = document.querySelectorAll(`span.score`);
  // console.log('lblBalDue ', $('span#lblBalDue').text());
  let myArr = [];

  console.log('---------');
  console.log(data);
  console.log(data.headTHS);
  console.log(data.footTHS);
  console.log('---------');
  for (let i = 0; i < data.headTHS.length; i++) {
    try {
      let headTh = data.headTHS[i].textContent;
      // console.log(headTh);
      let footTh = data.footTHS[i].textContent;
      // console.log(footTh);
      console.log('---------');
      myArr.push({ headTH: footTH });

    } catch (error) {
      // console.log(error);
      myArr = error;
    }
  }

  // const pageTitle = await page.title();
  await browser.close();
  // console.log(pageTitle);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: myArr
    })
  }

};

// run();