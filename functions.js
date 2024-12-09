const { match } = require("assert");
const assert = require("assert");
const fs = require("fs");

function buildPageURL(href, queryObjects) {

  const base = "https://www.zillow.com/";
  const searchQueryState = "?searchQueryState=";
  const pageNum = href.match(/\d+/)[0];
  queryObjects.pagination.currentPage = pageNum;
  let jsonStr = JSON.stringify(queryObjects);
  // {"pagination":{}
  // {"pagination":{"currentPage":2}
  const url = base + href + searchQueryState + encodeURIComponent(jsonStr);
  console.log(url);
  return url;
}

function getArizonaCountyCode(county) {

  let body = "{\"Filters\":[{\"FieldId\":9,\"BundleChildren\":[{\"FieldId\":\"1006\",\"FieldName\":\"StateFips\",\"Guid\":\"7172ec04-ede7-9881-2bf6-c28ad838df33\",\"OperatorId\":1,\"DisplayValues\":[\"Arizona\"],\"FilterValues\":[\"4\"]},{\"FieldId\":\"1007\",\"FieldName\":\"CountyFips\",\"Guid\":\"7172ec04-ede7-9881-2bf6-c28ad838df33\",\"OperatorId\":1,\"DisplayValues\":[\"Apache\",\"Cochise\",\"Coconino\",\"Gila\",\"Graham\",\"Greenlee\",\"La Paz\",\"Maricopa\",\"Mohave\",\"Navajo\",\"Pima\",\"Pinal\",\"Santa Cruz\",\"Yavapai\",\"Yuma\"],\"FilterValues\":[\"4001\",\"4003\",\"4005\",\"4007\",\"4009\",\"4011\",\"4012\",\"4013\",\"4015\",\"4017\",\"4019\",\"4021\",\"4023\",\"4025\",\"4027\"]}],\"FieldName\":\"StateCountyFips\"},{\"FieldId\":\"23\",\"FieldName\":\"LotAcreage\",\"Guid\":\"3cd4a6dc-74a2-29c6-c338-bb8f80e88d60\",\"FilterValues\":[\"20\",\"160\"],\"DisplayValues\":[\"20 - 160\"],\"OperatorId\":3}],\"ReturnAll\":false,\"CountOnly\":true}";
  let json = JSON.parse(body);
  const DisplayValues = json.Filters[0].BundleChildren[1].DisplayValues;
  const countyIndex = DisplayValues.indexOf(county);
  const FilterValues = json.Filters[0].BundleChildren[1].FilterValues;
  return FilterValues[countyIndex];

}

function getTexasCountyCode(county) {

  let body = "{\"Filters\":[{\"FieldId\":9,\"BundleChildren\":[{\"FieldId\":1006,\"FieldName\":\"StateFips\",\"OperatorId\":1,\"Guid\":\"c5553d6a-8955-fbf6-08f9-e7cd1344c6e5\",\"DisplayValues\":[\"Texas\"],\"FilterValues\":[\"48\"]},{\"FieldId\":\"1007\",\"FieldName\":\"CountyFips\",\"OperatorId\":1,\"Guid\":\"c5553d6a-8955-fbf6-08f9-e7cd1344c6e5\",\"DisplayValues\":[\"Anderson\",\"Andrews\",\"Angelina\",\"Aransas\",\"Archer\",\"Armstrong\",\"Atascosa\",\"Austin\",\"Bailey\",\"Bandera\",\"Bastrop\",\"Baylor\",\"Bee\",\"Bell\",\"Bexar\",\"Blanco\",\"Borden\",\"Bosque\",\"Bowie\",\"Brazoria\",\"Brazos\",\"Brewster\",\"Briscoe\",\"Brooks\",\"Brown\",\"Burleson\",\"Burnet\",\"Caldwell\",\"Calhoun\",\"Callahan\",\"Cameron\",\"Camp\",\"Carson\",\"Cass\",\"Castro\",\"Chambers\",\"Cherokee\",\"Childress\",\"Clay\",\"Cochran\",\"Coke\",\"Coleman\",\"Collin\",\"Collingsworth\",\"Colorado\",\"Comal\",\"Comanche\",\"Concho\",\"Cooke\",\"Coryell\",\"Cottle\",\"Crane\",\"Crockett\",\"Crosby\",\"Culberson\",\"Dallam\",\"Dallas\",\"Dawson\",\"De Witt\",\"Deaf Smith\",\"Delta\",\"Denton\",\"Dickens\",\"Dimmit\",\"Donley\",\"Duval\",\"Eastland\",\"Ector\",\"Edwards\",\"El Paso\",\"Ellis\",\"Erath\",\"Falls\",\"Fannin\",\"Fayette\",\"Fisher\",\"Floyd\",\"Foard\",\"Fort Bend\",\"Franklin\",\"Freestone\",\"Frio\",\"Gaines\",\"Galveston\",\"Garza\",\"Gillespie\",\"Glasscock\",\"Goliad\",\"Gonzales\",\"Gray\",\"Grayson\",\"Gregg\",\"Grimes\",\"Guadalupe\",\"Hale\",\"Hall\",\"Hamilton\",\"Hansford\",\"Hardeman\",\"Hardin\",\"Harris\",\"Harrison\",\"Hartley\",\"Haskell\",\"Hays\",\"Hemphill\",\"Henderson\",\"Hidalgo\",\"Hill\",\"Hockley\",\"Hood\",\"Hopkins\",\"Houston\",\"Howard\",\"Hudspeth\",\"Hunt\",\"Hutchinson\",\"Irion\",\"Jack\",\"Jackson\",\"Jasper\",\"Jeff Davis\",\"Jefferson\",\"Jim Hogg\",\"Jim Wells\",\"Johnson\",\"Jones\",\"Karnes\",\"Kaufman\",\"Kendall\",\"Kenedy\",\"Kent\",\"Kerr\",\"Kimble\",\"King\",\"Kinney\",\"Kleberg\",\"Knox\",\"La Salle\",\"Lamar\",\"Lamb\",\"Lampasas\",\"Lavaca\",\"Lee\",\"Leon\",\"Liberty\",\"Limestone\",\"Lipscomb\",\"Live Oak\",\"Llano\",\"Loving\",\"Lubbock\",\"Lynn\",\"Madison\",\"Marion\",\"Martin\",\"Mason\",\"Matagorda\",\"Maverick\",\"Mcculloch\",\"Mclennan\",\"Mcmullen\",\"Medina\",\"Menard\",\"Midland\",\"Milam\",\"Mills\",\"Mitchell\",\"Montague\",\"Montgomery\",\"Moore\",\"Morris\",\"Motley\",\"Nacogdoches\",\"Navarro\",\"Newton\",\"Nolan\",\"Nueces\",\"Ochiltree\",\"Oldham\",\"Orange\",\"Palo Pinto\",\"Panola\",\"Parker\",\"Parmer\",\"Pecos\",\"Polk\",\"Potter\",\"Presidio\",\"Rains\",\"Randall\",\"Reagan\",\"Real\",\"Red River\",\"Reeves\",\"Refugio\",\"Roberts\",\"Robertson\",\"Rockwall\",\"Runnels\",\"Rusk\",\"Sabine\",\"San Augustine\",\"San Jacinto\",\"San Patricio\",\"San Saba\",\"Schleicher\",\"Scurry\",\"Shackelford\",\"Shelby\",\"Sherman\",\"Smith\",\"Somervell\",\"Starr\",\"Stephens\",\"Sterling\",\"Stonewall\",\"Sutton\",\"Swisher\",\"Tarrant\",\"Taylor\",\"Terrell\",\"Terry\",\"Throckmorton\",\"Titus\",\"Tom Green\",\"Travis\",\"Trinity\",\"Tyler\",\"Upshur\",\"Upton\",\"Uvalde\",\"Val Verde\",\"Van Zandt\",\"Victoria\",\"Walker\",\"Waller\",\"Ward\",\"Washington\",\"Webb\",\"Wharton\",\"Wheeler\",\"Wichita\",\"Wilbarger\",\"Willacy\",\"Williamson\",\"Wilson\",\"Winkler\",\"Wise\",\"Wood\",\"Yoakum\",\"Young\",\"Zapata\",\"Zavala\"],\"FilterValues\":[\"48001\",\"48003\",\"48005\",\"48007\",\"48009\",\"48011\",\"48013\",\"48015\",\"48017\",\"48019\",\"48021\",\"48023\",\"48025\",\"48027\",\"48029\",\"48031\",\"48033\",\"48035\",\"48037\",\"48039\",\"48041\",\"48043\",\"48045\",\"48047\",\"48049\",\"48051\",\"48053\",\"48055\",\"48057\",\"48059\",\"48061\",\"48063\",\"48065\",\"48067\",\"48069\",\"48071\",\"48073\",\"48075\",\"48077\",\"48079\",\"48081\",\"48083\",\"48085\",\"48087\",\"48089\",\"48091\",\"48093\",\"48095\",\"48097\",\"48099\",\"48101\",\"48103\",\"48105\",\"48107\",\"48109\",\"48111\",\"48113\",\"48115\",\"48123\",\"48117\",\"48119\",\"48121\",\"48125\",\"48127\",\"48129\",\"48131\",\"48133\",\"48135\",\"48137\",\"48141\",\"48139\",\"48143\",\"48145\",\"48147\",\"48149\",\"48151\",\"48153\",\"48155\",\"48157\",\"48159\",\"48161\",\"48163\",\"48165\",\"48167\",\"48169\",\"48171\",\"48173\",\"48175\",\"48177\",\"48179\",\"48181\",\"48183\",\"48185\",\"48187\",\"48189\",\"48191\",\"48193\",\"48195\",\"48197\",\"48199\",\"48201\",\"48203\",\"48205\",\"48207\",\"48209\",\"48211\",\"48213\",\"48215\",\"48217\",\"48219\",\"48221\",\"48223\",\"48225\",\"48227\",\"48229\",\"48231\",\"48233\",\"48235\",\"48237\",\"48239\",\"48241\",\"48243\",\"48245\",\"48247\",\"48249\",\"48251\",\"48253\",\"48255\",\"48257\",\"48259\",\"48261\",\"48263\",\"48265\",\"48267\",\"48269\",\"48271\",\"48273\",\"48275\",\"48283\",\"48277\",\"48279\",\"48281\",\"48285\",\"48287\",\"48289\",\"48291\",\"48293\",\"48295\",\"48297\",\"48299\",\"48301\",\"48303\",\"48305\",\"48313\",\"48315\",\"48317\",\"48319\",\"48321\",\"48323\",\"48307\",\"48309\",\"48311\",\"48325\",\"48327\",\"48329\",\"48331\",\"48333\",\"48335\",\"48337\",\"48339\",\"48341\",\"48343\",\"48345\",\"48347\",\"48349\",\"48351\",\"48353\",\"48355\",\"48357\",\"48359\",\"48361\",\"48363\",\"48365\",\"48367\",\"48369\",\"48371\",\"48373\",\"48375\",\"48377\",\"48379\",\"48381\",\"48383\",\"48385\",\"48387\",\"48389\",\"48391\",\"48393\",\"48395\",\"48397\",\"48399\",\"48401\",\"48403\",\"48405\",\"48407\",\"48409\",\"48411\",\"48413\",\"48415\",\"48417\",\"48419\",\"48421\",\"48423\",\"48425\",\"48427\",\"48429\",\"48431\",\"48433\",\"48435\",\"48437\",\"48439\",\"48441\",\"48443\",\"48445\",\"48447\",\"48449\",\"48451\",\"48453\",\"48455\",\"48457\",\"48459\",\"48461\",\"48463\",\"48465\",\"48467\",\"48469\",\"48471\",\"48473\",\"48475\",\"48477\",\"48479\",\"48481\",\"48483\",\"48485\",\"48487\",\"48489\",\"48491\",\"48493\",\"48495\",\"48497\",\"48499\",\"48501\",\"48503\",\"48505\",\"48507\"]}],\"FieldName\":\"StateCountyFips\"},{\"FieldId\":55,\"FieldName\":\"LandUse\",\"OperatorId\":1,\"Guid\":\"5882a7e3-b4cc-1946-a462-1e7a2b5bf6e3\",\"FilterValues\":[\"520\",\"511\",\"540\",\"138\",\"135\",\"136\",\"137\",\"252\",\"560\",\"509\",\"998\",\"700\",\"455\",\"100\",\"460\",\"465\",\"160\",\"775\",\"163\",\"400\",\"454\"],\"DisplayValues\":[\"Fallow Land\",\"Farms\",\"Forest\",\"Manufactured Home\",\"Mobile Home Lot\",\"Mobile Home Park\",\"Mobile Home\",\"Parking Lot\",\"Pasture\",\"Ranch\",\"Real Property (Nec)\",\"Recreational (Nec)\",\"Recreational Acreage\",\"Residential (Nec)\",\"Residential Acreage\",\"Residential Lot\",\"Rural Homesite\",\"Rv Park\",\"Single Family Residence / Sfr\",\"Vacant Land (Nec)\",\"Vacant Mobile Home\"]},{\"FieldId\":23,\"FieldName\":\"LotAcreage\",\"OperatorId\":3,\"Guid\":\"88e7fc4e-9461-bc20-af9d-690d401c91bc\",\"FilterValues\":[\"2\",\"4\"],\"DisplayValues\":[\"2 - 4\"]},{\"FieldId\":11,\"FieldName\":\"DoNotMail\",\"OperatorId\":1,\"Guid\":\"f5edd236-da91-5119-593f-f4e98c3f1a8c\",\"FilterValues\":[\"0\"],\"DisplayValues\":[\"Exclude Do Not Mail\"]},{\"FieldId\":1027,\"FieldName\":\"AssdImprovementPercentage\",\"OperatorId\":3,\"Guid\":\"11b2b0ba-9e5d-595a-86c6-061b72f2b2ee\",\"FilterValues\":[\"0\",\"0\"],\"DisplayValues\":[\"0% - 0%\"]},{\"FieldId\":1031,\"FieldName\":\"MktImprovementPercentage\",\"OperatorId\":3,\"Guid\":\"a0637c9c-ad76-1291-2c9d-c9ba9a3b8594\",\"FilterValues\":[\"0\",\"0\"],\"DisplayValues\":[\"0% - 0%\"]},{\"FieldId\":1035,\"FieldName\":\"ApprImprovementPercentage\",\"OperatorId\":3,\"Guid\":\"ce452dc8-5caf-fa88-8ec8-064e8f44ac5e\",\"FilterValues\":[\"0\",\"0\"],\"DisplayValues\":[\"0% - 0%\"]}],\"ReturnAll\":false,\"CountOnly\":true}";
  let json = JSON.parse(body);
  const DisplayValues = json.Filters[0].BundleChildren[1].DisplayValues;
  const countyIndex = DisplayValues.indexOf(county);
  const FilterValues = json.Filters[0].BundleChildren[1].FilterValues;
  return FilterValues[countyIndex];

}

function createBody(county, lowAcres, highAcres) {

  // json.Filters[0].BundleChildren[1].DisplayValues
  // (1) ['Borden']
  // json.Filters[2].DisplayValues
  // (1) ['2 - 4']
  // json.Filters[2].FilterValues
  // (2) ['2', '4']

  // let countyCode = getTexasCountyCode(county);
  let countyCode = getArizonaCountyCode(county);
  console.log(countyCode);


  let body = "{\"Filters\":[{\"FieldId\":9,\"BundleChildren\":[{\"FieldId\":\"1006\",\"FieldName\":\"StateFips\",\"Guid\":\"7172ec04-ede7-9881-2bf6-c28ad838df33\",\"OperatorId\":1,\"DisplayValues\":[\"Arizona\"],\"FilterValues\":[\"4\"]},{\"FieldId\":\"1007\",\"FieldName\":\"CountyFips\",\"Guid\":\"7172ec04-ede7-9881-2bf6-c28ad838df33\",\"OperatorId\":1,\"DisplayValues\":[\"Apache\",\"Cochise\",\"Coconino\",\"Gila\",\"Graham\",\"Greenlee\",\"La Paz\",\"Maricopa\",\"Mohave\",\"Navajo\",\"Pima\",\"Pinal\",\"Santa Cruz\",\"Yavapai\",\"Yuma\"],\"FilterValues\":[\"4001\",\"4003\",\"4005\",\"4007\",\"4009\",\"4011\",\"4012\",\"4013\",\"4015\",\"4017\",\"4019\",\"4021\",\"4023\",\"4025\",\"4027\"]}],\"FieldName\":\"StateCountyFips\"},{\"FieldId\":\"23\",\"FieldName\":\"LotAcreage\",\"Guid\":\"3cd4a6dc-74a2-29c6-c338-bb8f80e88d60\",\"FilterValues\":[\"20\",\"160\"],\"DisplayValues\":[\"20 - 160\"],\"OperatorId\":3}],\"ReturnAll\":false,\"CountOnly\":true}";
  // let body= '{"Filters":[{"FieldId":9,"BundleChildren":[{"FieldId":1006,"FieldName":"StateFips","OperatorId":1,"Guid":"9cda3485-4c5c-efd6-0c57-42bac35d37c5","DisplayValues":["Texas"],"FilterValues":["48"]},{"FieldId":1007,"FieldName":"CountyFips","OperatorId":1,"Guid":"9cda3485-4c5c-efd6-0c57-42bac35d37c5","DisplayValues":["Borden"],"FilterValues":["48033"]}],"FieldName":"StateCountyFips"},{"FieldId":55,"FieldName":"LandUse","OperatorId":1,"Guid":"d8adf6c0-634a-5ffa-4a39-b1ee7dd1b9d7","FilterValues":["520","511","540","138","135","136","137","252","560","509","998","700","455","100","460","465","160","775","163","400","454"],"DisplayValues":["Fallow Land","Farms","Forest","Manufactured Home","Mobile Home Lot","Mobile Home Park","Mobile Home","Parking Lot","Pasture","Ranch","Real Property (Nec)","Recreational (Nec)","Recreational Acreage","Residential (Nec)","Residential Acreage","Residential Lot","Rural Homesite","Rv Park","Single Family Residence / Sfr","Vacant Land (Nec)","Vacant Mobile Home"]},{"FieldId":23,"FieldName":"LotAcreage","OperatorId":3,"Guid":"3bf769a6-ebfb-c101-d36d-af30d3076aa1","FilterValues":["2","4"],"DisplayValues":["2 - 4"]},{"FieldId":11,"FieldName":"DoNotMail","OperatorId":1,"Guid":"e783560e-a7ff-a842-3f50-36cde233b07e","FilterValues":["0"],"DisplayValues":["Exclude Do Not Mail"]},{"FieldId":1027,"FieldName":"AssdImprovementPercentage","OperatorId":3,"Guid":"70f3b8b6-4606-c62a-840f-df2bc8dd7f73","FilterValues":["0","0"],"DisplayValues":["0% - 0%"]},{"FieldId":1031,"FieldName":"MktImprovementPercentage","OperatorId":3,"Guid":"d3590e9b-b55b-7798-cd54-fb5db275bad2","FilterValues":["0","0"],"DisplayValues":["0% - 0%"]},{"FieldId":1035,"FieldName":"ApprImprovementPercentage","OperatorId":3,"Guid":"ab727fd9-1b48-9469-b873-5f1a3be58117","FilterValues":["0","0"],"DisplayValues":["0% - 0%"]}],"ReturnAll":false,"CountOnly":true}';
  let json = JSON.parse(body);

  json.Filters[0].BundleChildren[1].DisplayValues = [county];
  json.Filters[0].BundleChildren[1].FilterValues = [countyCode];
  json.Filters[2].DisplayValues = [lowAcres + ' - ' + highAcres];
  json.Filters[2].FilterValues = [lowAcres, highAcres];
  console.log(json);
  return JSON.stringify(json)

}


async function gotoExtended(page, request) {
  const { url, method, headers, postData } = request;

  if (method !== 'GET' || postData || headers) {
    let wasCalled = false;
    await page.setRequestInterception(true);
    const interceptRequestHandler = async (request) => {
      try {
        if (wasCalled) {
          return await request.continue();
        }

        wasCalled = true;
        const requestParams = {};

        if (method !== 'GET') requestParams.method = method;
        if (postData) requestParams.postData = postData;
        if (headers) requestParams.headers = headers;
        await request.continue(requestParams);
        await page.setRequestInterception(false);
      } catch (error) {
        log.debug('Error while request interception', { error });
      }
    };

    await page.on('request', interceptRequestHandler);
  }

  return page.goto(url);
}

async function buildNB(arr) {

  const data = fs.readFileSync("test2.ipynb");
  var nb = JSON.parse(data);

  // console.log("nb");
  // console.log(nb);

  // const cell1 = myHelpers.codeCell('conda run jupyter lab');
  // const cell2 = myHelpers.codeCell('conda run jupyter lab');
  // const mcell = myHelpers.markdownCell('1, 2, 3');
  console.log("cell");

  // nb['cells'] = [nbf.v4.new_markdown_cell(text),
  // nbf.v4.new_code_cell(code) ]

  nb.cells = arr; // source is an array of lines.
  // nb.cells.push(cell1);
  // nb.cells.push(cell2);
  // nb.cells.push(mcell);

  // console.log("nb2");
  // console.log(nb);


  const o = JSON.stringify(nb);
  fs.writeFileSync("test3.ipynb", o);


}

async function getFromStorageBy(index) {
  let match;
  const data = fs.readFileSync("storage.json");
  // Display the file content
  // console.log(index);
  const jsonArray = JSON.parse(data);
  const matches = jsonArray.filter(obj => obj.column == index);
  console.log('matches');
  console.log(matches);
  match = matches.pop();
  console.log(match);
  return match;
}

async function addToStorage(newObj) {
  fs.readFile("storage.json", function (err, data) {
    //Note initialize storage with []
    var jsonArray = JSON.parse(data);
    // uniqueFlag = true;
    const deepMatches = jsonArray.map((obj) => {
      return deepEqual(obj, newObj);
    });
    console.log(deepMatches);
    if (deepMatches.includes(true)) {
      console.log("obj already in array, will NOT be added!");
    } else {
      jsonArray.push(newObj);
      console.log("obj not in array,  added!");
    }
    fs.writeFile("storage.json", JSON.stringify(jsonArray), function (err) {
      if (err) throw err;
      console.log('The "data to append" is within the file!');
    });
  });
}

function deepEqual(a, b) {
  try {
    assert.deepEqual(a, b);
  } catch (error) {
    if (error.name === "AssertionError") {
      return false;
    }
    throw error;
  }
  return true;
}

async function getZipsByRadius() {
  var fetch = require("node-fetch");
  const res = await fetch(
    "https://api.geocode.earth/v1/autocomplete?api_key=ge-781e28d50fd43f16&text=Lubbock%2C+TX&size=10&boundary.country=USA",
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Chrome OS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        Referer: "https://www.unitedstateszipcodes.org/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  );

  const response = await res.json(); //response.content = html, response.cookies = cookies
  return response.content;
}

async function getHTMLWithScrapingant2(buildURL) {

  const fetch = require("node-fetch");


    const encodedURL = encodeURIComponent(buildURL);

    const apiUrl = `https://api.scrapingant.com/v2/general?url=${encodedURL}&x-api-key=3c59fe0e311a474694cd2849f594f135&return_page_source=true`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "useQueryString": true
        }
      });

      if (response.ok) {
        const body = await response.text();
        console.log(body);
        return body
      } else {
        console.error(`Request failed with status ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }

  }


  async function getHTMLWithScrapingant(buildURL) {

    var fetch = require("node-fetch");
    const jsSnippet = "&js_snippet=d2luZG93LnNjcm9sbFRvKDAsZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQpOwphd2FpdCBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgMjAwMCkpOw==";
    const res = await fetch(
      "https://api.scrapingant.com/v1/general?url=" +
      buildURL +
      "&proxy_country=US&browser=false&return_text=false",

      {
        headers: {
          "x-api-key": "3c59fe0e311a474694cd2849f594f135",
        },
      }
    );

    const response = await res.json(); //response.content = html, response.cookies = cookies
    return response.content;
    // }
  }

  async function getCsvdbPrompt(table) {
    const csvdb = require("csv-database");
    return await csvdb(
      table,
      [
        "COUNTIES",
        "2-20",
        "2-4",
        "LW2-4$",
        "LW2-4#",
        "4-6",
        "LW4-6$",
        "LW4-6#",
        "8-12",
        "LW8-12$",
        "LW8-12#",
        "18-22",
        "LW18-22$",
        "LW18-22#",
      ],
      ","
    );
  }

  async function getCellsByContent(cellContent, table) {
    const db = await getCsvdbPrompt(table);
    var arr = [];
    const all = await db.get();
    for (let row = 0; row < all.length; row++) {
      const asArray = await Object.entries(all[row]);
      // const filtered = asArray.filter(([key, value]) => value == "");
      const filtered = asArray.filter(([key, value]) => value == cellContent);
      const justStrings = Object.fromEntries(filtered);
      const keys = Object.keys(justStrings);
      const county = all[row].COUNTIES;
      const mappedKeys = keys.map((k) => row.toString() + ":" + county + ":" + k);
      arr = arr.concat(mappedKeys);
    }
    return arr;
  }

  async function buildLandWatchURL(empty) {
    const templateFn24 = (COUNTY) =>
      `https://www.landwatch.com/texas-land-for-sale/${COUNTY}-county/undeveloped-land/acres-2-4`;
    const templateFn46 = (COUNTY) =>
      `https://www.landwatch.com/texas-land-for-sale/${COUNTY}-county/undeveloped-land/acres-4-6`;
    const templateFn812 = (COUNTY) =>
      `https://www.landwatch.com/texas-land-for-sale/${COUNTY}-county/undeveloped-land/acres-8-12`;
    const templateFn1822 = (COUNTY) =>
      `https://www.landwatch.com/texas-land-for-sale/${COUNTY}-county/undeveloped-land/acres-18-22`;

    const pieces = empty.split(":");
    const row = pieces[0];
    const county = pieces[1];
    const key = pieces[2];

    // const empty = '0:lubbock:LW2-4$';

    var url;
    switch (true) {
      case key == "LW2-4$":
      case key == "LW2-4#":
        url = templateFn24(county);
        break;
      case key == "LW4-6$":
      case key == "LW4-6#":
        url = templateFn46(county);
        break;
      case key == "LW8-12$":
      case key == "LW8-12#":
        url = templateFn812(county);
        break;
      case key == "LW18-22$":
      case key == "LW18-22#":
        url = templateFn1822(county);
        break;
      default:
        console.log("NO URL TEMPLATE MATCH");
      // break;
    }

    // var url = encodeURIComponent(
    //   "https://www.landwatch.com/texas-land-for-sale/lubbock-county/undeveloped-land/acres-2-4"
    // );
    return url;
  }

  async function openHtml(htmlString) {
    const puppeteer = require("puppeteer-extra");
    // add stealth plugin and use defaults (all evasion techniques)
    // const StealthPlugin = require("puppeteer-extra-plugin-stealth");
    const StealthPlugin = require("puppeteer-extra-plugin-stealth");

    puppeteer.use(StealthPlugin());
    const { executablePath } = require('puppeteer')

    // puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({
      headless: false,
      executablePath: executablePath(),
      userDataDir: "./data",
      args: [
        "--start-maximized",
        // '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36'
      ],
    });

    const page = await browser.newPage();
    await page.setContent(htmlString);
    // return;
    // await browser.close();
  }


  async function blockTextToArrayWithFilter(blockText, regex) {
    let blockTextArr = blockText.split('\n')
    let outArr = [];
    for (let i = 0; i < blockTextArr.length; i++) {
      const element = blockTextArr[i].trim();
      if (regex.test(element)) {
        outArr.push(element)
      }
    }
    return outArr
  }


  async function waitForSelectors(selectors, frame, timeout) {
    for (const selector of selectors) {
      try {
        return await waitForSelector(selector, frame, timeout);
      } catch (err) {
        console.error(err);
      }
    }
    throw new Error(
      "Could not find element for selectors: " + JSON.stringify(selectors)
    );
  }

  async function waitForSelector(selector, frame, timeout) {
    if (selector instanceof Array) {
      let element = null;
      for (const part of selector) {
        if (!element) {
          element = await frame.waitForSelector(part, { timeout });
        } else {
          element = await element.$(part);
        }
        if (!element) {
          throw new Error("Could not find element: " + part);
        }
        element = (
          await element.evaluateHandle((el) =>
            el.shadowRoot ? el.shadowRoot : el
          )
        ).asElement();
      }
      if (!element) {
        throw new Error("Could not find element: " + selector.join("|"));
      }
      return element;
    }
    const element = await frame.waitForSelector(selector, { timeout });
    if (!element) {
      throw new Error("Could not find element: " + selector);
    }
    return element;
  }

  async function waitForElement(step, frame, timeout) {
    const count = step.count || 1;
    const operator = step.operator || ">=";
    const comp = {
      "==": (a, b) => a === b,
      ">=": (a, b) => a >= b,
      "<=": (a, b) => a <= b,
    };
    const compFn = comp[operator];
    await waitForFunction(async () => {
      const elements = await querySelectorsAll(step.selectors, frame);
      return compFn(elements.length, count);
    }, timeout);
  }

  async function querySelectorsAll(selectors, frame) {
    for (const selector of selectors) {
      const result = await querySelectorAll(selector, frame);
      if (result.length) {
        return result;
      }
    }
    return [];
  }

  async function querySelectorAll(selector, frame) {
    if (selector instanceof Array) {
      let elements = [];
      let i = 0;
      for (const part of selector) {
        if (i === 0) {
          elements = await frame.$$(part);
        } else {
          const tmpElements = elements;
          elements = [];
          for (const el of tmpElements) {
            elements.push(...(await el.$$(part)));
          }
        }
        if (elements.length === 0) {
          return [];
        }
        const tmpElements = [];
        for (const el of elements) {
          const newEl = (
            await el.evaluateHandle((el) => (el.shadowRoot ? el.shadowRoot : el))
          ).asElement();
          if (newEl) {
            tmpElements.push(newEl);
          }
        }
        elements = tmpElements;
        i++;
      }
      return elements;
    }
    const element = await frame.$$(selector);
    if (!element) {
      throw new Error("Could not find element: " + selector);
    }
    return element;
  }

  async function waitForFunction(fn, timeout) {
    let isActive = true;
    setTimeout(() => {
      isActive = false;
    }, timeout);
    while (isActive) {
      const result = await fn();
      if (result) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error("Timed out");
  }

  exports.waitForSelectors = waitForSelectors;
  exports.waitForSelector = waitForSelector;
  exports.waitForElement = waitForElement;
  exports.waitForFunction = waitForFunction;
  exports.querySelectorAll = querySelectorAll;
  exports.querySelectorsAll = querySelectorsAll;
  exports.openHtml = openHtml;
  exports.getCsvdbPrompt = getCsvdbPrompt;
  exports.getCellsByContent = getCellsByContent;
  exports.buildLandWatchURL = buildLandWatchURL;
  exports.getHTMLWithScrapingant = getHTMLWithScrapingant;
  exports.getHTMLWithScrapingant2 = getHTMLWithScrapingant2;
  exports.getZipsByRadius = getZipsByRadius;
  exports.addToStorage = addToStorage;
  exports.getFromStorageBy = getFromStorageBy;
  exports.buildNB = buildNB;
  exports.gotoExtended = gotoExtended;
  exports.createBody = createBody;
  exports.getTexasCountyCode = getTexasCountyCode;
  exports.getArizonaCountyCode = getArizonaCountyCode;
  exports.buildPageURL = buildPageURL;
  exports.blockTextToArrayWithFilter = blockTextToArrayWithFilter;