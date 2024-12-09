// const dJSON = require('dirty-json');
// const axios = require("axios")
const cheerio = require("cheerio");
// const fetch = require("node-fetch");

async function csvToJSON(csv) {
  // var lines = csv.split("\n\r");
  var lines = csv
  var result = [];
  var headers;
  headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var obj = {};

    if (lines[i] == undefined || lines[i].trim() == "") {
      continue;
    }

    var words = lines[i].split(",");
    for (var j = 0; j < words.length; j++) {
      obj[headers[j].trim()] = words[j];
    }

    result.push(obj);
  }
  console.log(result);
  return result;
}

function codeCell(arr) {
  return {
    cell_type: 'code',
    execution_count: null,
    metadata: { tags: [] },
    outputs: [],
    source: arr
  };
}

function markdownCell(str) {
  return { cell_type: 'markdown', metadata: {}, source: str }; // words in ''
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

parseNum = str => +str.replace(/[^.\d]/g, '');



function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomSleep(min, max) {
  const ms = randomIntFromInterval(min, max);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function detailUrls(arr) {
  return arr.map((r) => `https://esearch.hayscad.com/Property/View/${r}`);
}

function urls(ll, ul) {
  const url = "https://esearch.hayscad.com/Property/View/R";
  var urlArray = [];

  for (let index = ll; index <= ul; index++) {
    const element = (url + index).toString();
    urlArray.push(element);
  }
  // console.log(urlArray);
  return urlArray;
}

function alphaUrls() {
  ``;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const urlTemplate =
    "https://esearch.hayscad.com/Search/SearchResults/?keywords=XX&filter=&page=1&pageSize=100&skip=0&take=100";

  var subStringArray = [];

  for (let index1 = 0; index1 <= 25; index1++) {
    for (let index2 = 0; index2 <= 25; index2++) {
      subStringArray.push(alphabet[index1] + alphabet[index2]);
    }
  }
  const sorted = subStringArray.sort();
  console.log(sorted);
  const urlArray = sorted.map((x) => urlTemplate.replace("XX", x));
  // console.log(urlArray.slice(0,20));
  return urlArray;
}

function testJSON() {
  return '{"ResultsList":[{"PropertyId":"R166975","Year":2020,"PropertyType":"Real","PropertyTypeCode":"R","GeoId":"11-0108-0000-00100-3","NeighborhoodCode":"C-SM-35CW","Address":"1644 AQUARENA SPRINGS DR, SAN MARCOS, TX  78666","LegalDescription":"AQUARENA SPRINGS SUB, Lot 1, ACRES 1.218","OwnerName":"QUICK N CLEAN XX","OwnerId":"O0099719","AppraisedValue":682250,"UseOwnerId":false,"StreetNumber":1644,"StreetName":"AQUARENA SPRINGS","DoingBusinessAs":"","Abstract":"","Subdivision":"S0108 - AQUARENA SPRINGS SUB","MobileHomePark":"","Condo":"","PercentOwnership":"100.0000000000","TaxesPaid":true,"HasBaseTax":false,"InCart":false,"Status":"Certification","HideValues":false,"MapAddress":"1644 AQUARENA SPRINGS DR, SAN MARCOS, TX  78666","AppraisedValueDisplay":"$682,250","DetailUrl":"/Property/View/R166975","PaymentProcessor":0},{"PropertyId":"R87379","Year":2020,"PropertyType":"Real","PropertyTypeCode":"R","GeoId":"11-9952-0000-00300-3","NeighborhoodCode":"C-SM-ORR12","Address":"1720 RR 12, SAN MARCOS, TX  78666","LegalDescription":"WYATT ADDN, LOT 3, ACRES 5.80","OwnerName":"MGP XXIII LLC","OwnerId":"O9156850","AppraisedValue":3250000,"UseOwnerId":false,"StreetNumber":1720,"StreetName":"RR 12","DoingBusinessAs":"HORIZON BAY RETIREMENT LIVING","Abstract":"","Subdivision":"S9952 - WYATT ADDN","MobileHomePark":"","Condo":"","PercentOwnership":"100.0000000000","TaxesPaid":true,"HasBaseTax":false,"InCart":false,"Status":"Certification","HideValues":false,"MapAddress":"1720 RR 12, SAN MARCOS, TX  78666","AppraisedValueDisplay":"$3,250,000","DetailUrl":"/Property/View/R87379","PaymentProcessor":0}],"TotalResults":2,"SearchTerm":"XX","SearchTermClean":"XX","SearchTermExact":""XX"","SearchTermNonExact":"XX","Page":1,"PageSize":100,"TotalPages":1,"TotalTime":0.072,"Filter":"","Sort":"","SortClean":"","IsDesc":false,"PreviousPage":1,"NextPage":1}';
}

function jsonParser(data) {
  var parsed;

  try {
    parsed = dJSON.parse(data);
    // console.log(parsed);
  } catch (e) {
    parsed = null;
    console.log(e.message);
  }

  return parsed;
}

function returnTable() {
  // return `
  // <tbody><tr class="active"><td colspan="2">&nbsp;</td></tr>\n                        <tr><th>Improvement Homesite Value:</th><td class="table-number">$0</td></tr>\n                        <tr><th>Improvement Non-Homesite Value:</th><td class="table-number">$177,240</td></tr>\n                        <tr><th>Land Homesite Value:</th><td class="table-number">$0</td></tr>\n                        <tr><th>Land Non-Homesite Value:</th><td class="table-number">$30,000</td></tr>\n  …lue may increase at a rate of up to ten percent per year until it matches the district’s appraised market value."></i>\n                            </th>\n                            <td class="table-number">$0</td>\n                        </tr>\n                        <tr class="active">\n                            <td colspan="2">&nbsp;</td>\n                        </tr>\n                        <tr><th>Assessed Value:</th><td class="table-number">$207,240</td></tr>\n                    </tbody>'
}

function horizontaltableHtmlToRowObjects(
  html,
  TABLE_HEAD_SELECTOR,
  TABLE_ROW_SELECTOR
) {
  // TRY TO USE SELECTORS INSTEAD OF XPATH - PUPETEER HAS BETTER SUPPORT
  // https: //yizeng.me/2014/03/23/evaluate-and-v$(row).find('th').text()alidate-xpath-css-selectors-in-chrome-developer-tools/
  // https://techbrij.com/css-selector-adjacent-child-sibling

  const $ = cheerio.load(html, null, false);
  console.log("hello");
  let o = {};

  $("tbody > tr").each((i, row) => {
    const th = $(row).find("th").text().trim().toLowerCase();
    console.log(th);
    const td = $(row).find("td").text().trim().toLowerCase();
    console.log(td);
    o[th] = td;
  });
  return o;
}

function getSubstringBetween(str, a, b) {
  return str.substring(str.lastIndexOf(a) + 1, str.lastIndexOf(b));
}

    async function getTableFooter(html) {

      const $ = cheerio.load(html, null, false);

      // $("table> thead > tr").each((i, row) => {
      //     console.log($(row).find("th").text());
      //   });
      let myArr = [];
      // #tblAcctBal > thead > tr > th:nth-child(1)
      // const headerRow = await $('table#tblAcctBal > thead > tr');
      const headerRow = $('thead > tr');
      // const footerRow = $("table#tblAcctBal > tfoot > tr");
      const footerRow = $('tfoot > tr');
      const headThs = [...$(headerRow).find('th')];
      const footThs = [...$(footerRow).find('th')];
      for (let i = 0; i < headThs.length; i++) {
        try {
          const headTh = headThs[i];
          console.log($(headTh).text());
          const footTh = footThs[i];
          console.log($(footTh).html());
          console.log('---------');
          // myArr.push({headTh:footTh});

        } catch (error) {
          console.log(error);
        }

      }
  // const 
  console.log(myArr);

  const hrefs = [...$("div#list div > div > a")]
  $("table >tfoot > tr").each((i, row) => {
    console.log($(row).find("th").text());
  });
  console.log("hi");
  return true;

}

function findRegexInText(str, regex) {
  let a = [];
  for (const m of str.matchAll(regex) || []) {
    for (const group of m) {
      if (group) {
        a.push(group.trim());
      }
    }
  }
  return a[1]; // return first capture group [0] is match
}

function findMatch(searches) {
  for (const [substr, regex] of searches) {
    const result = findRegexInText(substr, regex);
    if (result) return result;
  }
}

function tableHtmlToRowObjects(html) {
  // TRY TO USE SELECTORS INSTEAD OF XPATH - PUPETEER HAS BETTER SUPPORT
  // https: //yizeng.me/2014/03/23/evaluate-and-validate-xpath-css-selectors-in-chrome-developer-tools/
  const $ = cheerio.load(html, null, false);

  // const TABLE_HEAD_SELECTOR = tableSelector + ' > tbody tr';
  // const TABLE_ROW_SELECTOR = tableSelector + ' > tbody tr';

  var head1 = $("tbody > tr > th").html();
  console.log(head1);
  const head = $("tbody").find("th").text();

  // const rows = $("tbody tr").each((index, row) => {console.log(index, row)});

  // const rows = $("tbody tr").map((index, row) => {$(row).find('td').map(c => $(c).text())

  console.log("hello");
  const rows = $("tbody > tr").map((row) => {
    return $(row).find("td");
  });

  $("tbody > tr").each((i, row) => {
    console.log($(row).find("td").text());
  });
  console.log("hi");
  // // console.log(result[1][2]); // "C2"
  const scrapedData = [];
  const tableHeaders = [];
  $("tbody > tr").each((index, element) => {
    if (index === 0) {
      const ths = $(element).find("th");
      $(ths).each((i, element) => {
        tableHeaders.push($(element).text().toLowerCase());
      });
      return true;
    }
    const tds = $(element).find("td");
    const tableRow = {};
    $(tds).each((i, element) => {
      tableRow[tableHeaders[i]] = $(element).text().trim();
    });
    scrapedData.push(tableRow);
  });
  console.log(scrapedData);

  return scrapedData;
}

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  // console.log(data);
  // await new Promise(function(resolve, reject) {
  //     resolve(setTimeout(console.log('random delay of '+rn.toString(),rn)))
  // })
  return cheerio.load(data);
}

async function getTablePuppeteer(page) {
  // TRY TO USE SELECTORS INSTEAD OF XPATH - PUPETEER HAS BETTER SUPPORT
  // https: //yizeng.me/2014/03/23/evaluate-and-validate-xpath-css-selectors-in-chrome-developer-tools/

  const tableSelector =
    "div:nth-child(4) div.container.main-content div.panel.panel-primary:nth-child(6) div.table-responsive > table.table.table-striped.table-bordered.table-condensed";
  const TABLE_HEAD_SELECTOR = tableSelector + " > tbody tr";
  const TABLE_ROW_SELECTOR = tableSelector + " > tbody tr";

  var head = await page.$$eval(TABLE_HEAD_SELECTOR, (rows) => {
    console.log(rows);
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll("th");
      console.log(columns);
      return Array.from(columns, (column) => column.innerText);
    });
  });

  var body = await page.$$eval(TABLE_ROW_SELECTOR, (rows) => {
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll("td");
      return Array.from(columns, (column) => column.innerText);
    });
  });

  // console.log(result[1][2]); // "C2"

  console.log(head); // "C2"
  console.log(body); // "C2"
  const filteredHead = await head.filter((x) => x.length);
  const filteredBody = await body.filter((x) => x.length);

  // console.log(filtered);

  var obj_arr = [];
  var keys = filteredHead[0];
  for (let index = 0; index < filteredBody.length; index++) {
    var row = filteredBody[index];
    var obj = {};
    for (let i = 0; i < keys.length; i++) {
      var k = keys[i];
      obj[k] = row[i];
      console.log(obj);
    }
    obj_arr.push(obj);
  }

  console.log(obj_arr);
  return obj_arr;
}

const x = "                Code: M1   ";
const regex1 = /Code:(.*)$/gm;
// console.log(findRegexInText(x, regex1))

// (async () => {
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()

//   const navigationPromise = page.waitForNavigation()

//   await page.goto('https://esearch.hayscad.com/Property/View/R100039')

//   await page.setViewport({ width: 1536, height: 769 })

//   await navigationPromise

//   await browser.close()
// })
// console.log(detailUrls(['hi','l']));
// getDetailPage(R);
// alphaUrls();
// urls(1,3);
// jsonParser(testJSON());
// console.log( returnTable())
// getTable(returnTable(), codeTableXpath)

// module.exports.urls = urls;
module.exports = {
  urls,
  alphaUrls,
  testJSON,
  shuffleArray,
  randomIntFromInterval,
  jsonParser,
  detailUrls,
  returnTable,
  tableHtmlToRowObjects,
  horizontaltableHtmlToRowObjects,
  findRegexInText,
  getSubstringBetween,
  findMatch,
  fetchHTML,
  randomSleep,
  codeCell,
  markdownCell,
  parseNum,
  csvToJSON,
  getTableFooter
};
