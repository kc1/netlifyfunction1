const express = require("express");
const app = express();
// const port/port = 3000;
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs"); // Set EJS as the template engine
app.use(express.static("public")); // If you have static files to serve
app.use(express.json()); // for application/json
app.use(express.urlencoded({ extended: true }));

const fs = require("fs").promises;
const myFunctions = require("./functions");
const myHelpers = require("./helpers");
const parcelFact = require("./netlify/functions/ParcelFact");
const landcom = require("./landcom");
const distances = require("./Distances");
const randSleep = myHelpers.randomSleep;
const runlandcom = landcom.runlandcom;
const addLocation = landcom.addLocation;
// const getDistances = distances.getDistances;
require("dotenv").config();
// console.log(process.env) // remove this after you've confirmed it is working
const { MongoClient } = require("mongodb");
// var murl = "mongodb://localhost:27017/"
var murl = process.env.MONGODB_URI;
const client = new MongoClient(murl);
client.connect();
const database = client.db("mydata");
let collection = database.collection("wisconsinOnSale");
let ignorethiszz;
let firstNum = 0;
let lastNum = 3;
let myArgs = process.argv.slice(2);
console.log(myArgs);
if (myArgs && myArgs[0] && parseInt(myArgs[0]) != NaN) {
  console.log(myArgs);
  firstNum = parseInt(myArgs[0]);
  lastNum = parseInt(myArgs[1]);
}
console.log(firstNum + " ... " + lastNum);

const { tryImplForWrapper } = require("jsdom/lib/jsdom/living/generated/utils");

// const openHtml = myFunctions.openHtml;
// const getSubstringBetween = myHelpers.getSubstringBetween;
const { JSDOM } = require("jsdom");
const { exit } = require("process");

// const axios = require('axios');
// const cheerio = require('cheerio');
// const { DateTime } = require('luxon');

async function getPaginationNumber(html) {
  const { window } = await new JSDOM(html);
  const $ = require("jquery")(window);

  // Select the div element by its class name
  const targetDiv = $(
    ".base__StyledType-rui__sc-108xfm0-0.kpUjhd.mobile-current"
  );

  // Get the text content of the selected div
  const textContent = targetDiv.text();
  const textArr = textContent.split("of");
  return textArr[1].trim();
}

async function parseAgentdata(html) {
  const { window } = await new JSDOM(html);
  const $ = require("jquery")(window);

  // const sel = "div[class*='AgentDetailsSubtext']";
  // const agentStr = await $(sel).text();
  // console.log( "o ",agentStr);

  const sel1 = "#__NEXT_DATA__";
  const json = $(sel1).text();
  const objs = JSON.parse(json);
  // console.log(objs);
  const advertisers =
    objs.props.pageProps.initialReduxState.propertyDetails.advertisers;
  console.log(advertisers);
  myArr = [];
  for (let i = 0; i < advertisers.length; i++) {
    const advertiser = advertisers[i];
    let agentData = {};
    agentData.emails = [];
    agentData.phones = [];
    agentData.name = advertiser.name;
    agentData.emails.push(advertiser.email);
    agentData.emails.push(advertiser.office.email);
    const phones = advertiser.phones;
    for (let j = 0; j < phones.length; j++) {
      const phone = phones[j];
      agentData.phones.push(phone.number);
    }
    myArr.push(agentData);
  }
  console.log(myArr);
  return myArr;
}

async function parsePage(html) {
  const { window } = await new JSDOM(html);
  const $ = require("jquery")(window);

  const sel = "#__NEXT_DATA__";
  const jsonInString = $(sel).text();
  console.log(jsonInString);

  const myJson = await JSON.parse(jsonInString);
  const propArr = myJson.props.pageProps.properties;
  // console.log(propArr[0]);
  let coordinates = [];
  if (propArr) {
    for (let i = 0; i < propArr.length; i++) {
      const property = propArr[i];
      const flagObj = property.flags;
      const flagKeys = Object.keys(flagObj);
      let myflags = [];
      for (let i = 0; i < flagKeys.length; i++) {
        const flagkey = flagKeys[i];
        if (flagObj[flagkey]) {
          myflags.push(flagkey);
        }
      }
      const lot_sqft = property?.description?.lot_sqft;
      const lot_acres = lot_sqft / 43560;
      const ppa = property.list_price / lot_acres;
      const county = property?.location?.county?.name;
      const address = property?.location?.address?.line;
      // const myLink = 'https://www.realtor.com/realestateandhomes-detail/' + property.permalink + "?from=srp-list-card";
      const myLink =
        "https://www.realtor.com/realestateandhomes-detail/" +
        property.permalink +
        "?from=srp";
      coordinates.push({
        lot_acres: lot_acres,
        ppa: ppa,
        listing_id: property.listing_id,
        coordinate: property.location.address.coordinate,
        price: property.list_price,
        list_date: property.list_date,
        AAlink: myLink,
        flags: myflags.join(","),
        address: address,
        county: county,
        lot_sqft: lot_sqft,
      });
    }
  }
  return coordinates;
}

async function upsertObjects(objArr) {
  try {
    if (objArr.length) {
      const result = await collection.insertMany(objArr, { ordered: false });
      return `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`;
    } else {
      return "0 records";
    }
  } catch (error) {
    return error;
  }
}

// https://www.realtor.com/realestateandhomes-detail/Bulldog-Blvd_Tuscaloosa_AL_35453_M98864-72252?from=srp-list-card
// https://www.realtor.com/realestateandhomes-detail/Bulldog-Blvd_Tuscaloosa_AL_35453_M98864-72252?from=srp-list-card
// https://www.realtor.com/realestateandhomes-detail/4405-Schillinger-Rd-N_Semmes_AL_36575_M86166-35355?from=srp-map-list
// https://www.realtor.com/realestateandhomes-detail/4405-Schillinger-Rd-N_Semmes_AL_36575_M86166-35355?from=srp-list-card

async function getURL(val) {
  const urls = {
    al: "https://www.realtor.com/realestateandhomes-search/Alabama/type-land/lot-sqft-217800/price-na-200000/sby-6?view=map",
    ms: "https://www.realtor.com/realestateandhomes-search/Mississippi/type-land/lot-sqft-87120/price-na-60000/sby-6?view=map",
    zip: "https://www.realtor.com/realestateandhomes-search/Mississippi/type-land/lot-sqft-87120/price-na-60000/sby-6?view=map",
    wi: "https://www.realtor.com/realestateandhomes-search/Wisconsin/type-land/lot-sqft-217800/price-na-200000/sby-6?view=map",
  };
  let url;
  const keys = Object.keys(urls);
  if (keys.includes(val)) {
    url = urls[val];
  }
  return url;
}

async function getRecordsAfterDateTime(collection, dt, st) {
  // const { MongoClient } = require('mongodb');

  // async function queryDatabase() {
  //   const uri = 'mongodb://localhost:27017/your_database_name'; // Replace with your MongoDB URI
  const startDate = new Date(dt); // Replace with your start date
  const quotedStartDate = "'" + startDate + "'";

  //   const client = new MongoClient(uri, { useUnifiedTopology: true });
  let docs;
  try {
    // await client.connect();

    // const db = client.db('your_database_name'); // Replace with your database name
    // const collection = db.collection('your_collection_name'); // Replace with your collection name

    const query = { list_date: { $gte: dt }, state: st };
    console.log(query);
    // const query  = { list_date: { '$gte': "2023-09-01T23:46:35.690Z" } }

    docs = await collection.find(query).toArray();
    // console.log('docs ', docs);

    // console.log(docs); // The documents where list_date is equal to or later than startDate
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // await client.close();
    console.log("hello");
    // console.log(docs[0]);
  }
  // }
  return docs;
  // queryDatabase();
}

const startURL =
  "https://www.realtor.com/realestateandhomes-search/Mississippi/type-land/lot-sqft-87120/price-na-60000/sby-6?view=map";
const baseURL = (i) =>
  `https://www.realtor.com/realestateandhomes-search/Mississippi/type-land/lot-sqft-87120/price-na-60000/sby-6/pg-${i}?view=map`;

// (async () => {
async function run() {
  const html1 = await myFunctions.getHTMLWithScrapingant(myURL);
  const objArr = await parsePage(html1);
  const o = await upsertObjects(objArr);
  return o;
  // console.log(o);
  // const pageNum = await getPaginationNumber(html1);
  // for (let i = 2; i <= pageNum; i++) {
  //     const myURL = baseURL(i);
  //     console.log(myURL);
  // }
}

async function updateFirstPageFlags(myURL, state) {
  const html = await myFunctions.getHTMLWithScrapingant2(myURL);
  if (!html) {
    console.log("no html in scrapefirstpage -- blocked?");
    return;
  }
  const objArr = await parsePage(html);
  // let counter = 0;

  // here you have to update each object one at a time
  // Filter criteria to find the document
  for (let i = 0; i < objArr.length; i++) {
    let obj = objArr[i];
    obj["state"] = state;
    obj["updatedAt"] = new Date();
    console.log("current obj: ", obj);

    // try {
    //   const filter = { listing_id: obj.listing_id };
    //   // Create the update operation with upsert: true
    //   // const update = {
    //   //     $set: obj
    //   // };

    //   const options = {
    //     upsert: true, // Insert if document not found
    //     // returnOriginal: false, // Return the updated document
    //   };

    //   // Perform the update operation
    //   // const result = await collection.findOneAndUpdate(filter, upiwdate, options);
    //   const result = await collection.replaceOne(filter, obj, options);

    //   if (result.value) {
    //     // Document was found and updated
    //     console.log("Document updated:", result.value);
    //   } else {
    //     // Document was not found and inserted
    //     console.log("Document inserted");
    //   }

    //   counter = counter + 1;
    //   console.log("counter: ", counter);
    //   // console.log('Upserted document:', result.upsertedId || filter);
    // } catch (err) {
    //   console.error("Error:", err);
    // }
  }
  return objArr;
}

async function scrapeFirstPage(myURL, state) {
  const html = await myFunctions.getHTMLWithScrapingant2(myURL);
  if (!html) {
    console.log("no html in scrapefirstpage -- blocked?");
    return;
  }
  const objArr = await parsePage(html);
  let counter = 0;

  // here you have to update each object one at a time
  // Filter criteria to find the document
  for (let i = 0; i < objArr.length; i++) {
    let obj = objArr[i];
    obj["state"] = state;
    obj["updatedAt"] = new Date();
    console.log("current obj: ", obj);

    try {
      const filter = { listing_id: obj.listing_id };
      // Create the update operation with upsert: true
      // const update = {
      //     $set: obj
      // };

      const options = {
        upsert: true, // Insert if document not found
        // returnOriginal: false, // Return the updated document
      };

      // Perform the update operation
      // const result = await collection.findOneAndUpdate(filter, upiwdate, options);
      const result = await collection.replaceOne(filter, obj, options);

      if (result.value) {
        // Document was found and updated
        console.log("Document updated:", result.value);
      } else {
        // Document was not found and inserted
        console.log("Document inserted");
      }

      counter = counter + 1;
      console.log("counter: ", counter);
      // console.log('Upserted document:', result.upsertedId || filter);
    } catch (err) {
      console.error("Error:", err);
    }
  }
  return objArr;
}

async function getDataByState(zip, area) {}

async function getDataByAreaAndZip(zip, min, max) {
  // https://www.realtor.com/realestateandhomes-search/39661/type-land/lot-sqft-87120-217800/sby-6?view=map
  // const base = (z, a) => `https://www.realtor.com/realestateandhomes-search/39661/type-land/lot-sqft-87120-217800/sby-6?view=map`;
  const base = (z, min, max) =>
    `https://www.realtor.com/realestateandhomes-search/${z}/type-land/lot-sqft-${min}-${max}/sby-6?view=map`;
  const myURL = base(zip, min, max);
  console.log(myURL);
  const data = await scrapeFirstPage(myURL, zip);
  return data;
}

async function getAgents(zip) {
  const myURL = `https://www.realtor.com/realestateagents/${zip}`;
  const html = await myFunctions.getHTMLWithScrapingant2(myURL);
  if (!html) {
    console.log("no html in scrapefirstpage -- blocked?");
    return;
  }
  const { window } = await new JSDOM(html);
  const $ = require("jquery")(window);

  const sel = "#__NEXT_DATA__";
  const jsonInString = $(sel).text();
  console.log(jsonInString);

  const myJson = await JSON.parse(jsonInString);
  const agents = myJson.props.pageProps.pageData.agents;
  console.log(agents);
  myArr = [];
  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    console.log(agent);
    let agentData = {};
    // agentData.emails = [];
    // agentData.phones = [];
    agentData.first_name = agent.first_name;
    agentData.last_name = agent.last_name;
    // agentData.emails.push(advertiser.email);
    // agentData.emails.push(advertiser.office.email);
    let phoneArray = [];
    const phones = agent.phones;
    for (let j = 0; j < phones.length; j++) {
      const phone = phones[j];
      phoneArray.push(phone.type + ":" + phone.number);
    }
    agentData.phones = phoneArray.join();
    myArr.push(agentData);
  }
  console.log(myArr);

  // agents[0].phones
  // agents[0].office.phone_list
  return myArr;
}

async function getDetailPageData(myURL) {
  const html = await myFunctions.getHTMLWithScrapingant2(myURL);
  if (!html) {
    console.log("no html in scrapefirstpage -- blocked?");
    return;
  }
  const { window } = await new JSDOM(html);
  const $ = require("jquery")(window);

  const sel = "#__NEXT_DATA__";
  const jsonInString = $(sel).text();
  console.log(jsonInString);

  const myJson = await JSON.parse(jsonInString);
  return myJson;
}
// app.get('/', (req, res) => {
//     res.render('component1'); // Renders template.ejs
//   });
app.get("/forSale", async (req, res) => {
  try {
    const st = req.query.val;
    console.log("Received Val in data:", st);
    const queryURL = await getURL(st);
    console.log(queryURL);
    const data = await getDetailPageData(queryURL, st);
    res.status(200).json({ data: data });
    // res.status(200).render({'data':JSON.stringify(data)});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/data", async (req, res) => {
  try {
    const st = req.query.val;
    console.log("Received Val in data:", st);
    const queryURL = await getURL(st);
    console.log(queryURL);
    const data = await scrapeFirstPage(queryURL, st);
    res.status(200).json({ data: data });
    // res.status(200).render({'data':JSON.stringify(data)});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/updateRealtorFlags", async (req, res) => {
  try {

    // wi: "https://www.realtor.com/realestateandhomes-search/Wisconsin/type-land/lot-sqft-217800/price-na-200000/sby-6?view=map",
    const st = req.query.val;
    console.log("Received Val in data:", st);
    const queryURL = await getURL(st);
    console.log(queryURL);
    const data = await updateFirstPageFlags(queryURL, st);
    res.status(200).json({ data: data });
    // res.status(200).render({'data':JSON.stringify(data)});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/detailPageData", async (req, res) => {
  try {
    const myURL = req.query.val;
    // console.log("Received Val in data:", st);
    // const queryURL = await getURL(st);
    // console.log(queryURL);
    const data = await getDetailPageData(myURL);
    res.status(200).json({ data: data });
    // res.status(200).render({'data':JSON.stringify(data)});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/agentsByZip", async (req, res) => {
  try {
    const zip = req.query.zip;
    console.log("Received zip in data:", zip);
    // const queryURL = await getURL(st);
    // console.log(queryURL);
    const data = await getAgents(zip);
    res.status(200).json({ data: data });
    // res.status(200).render({'data':JSON.stringify(data)});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/findAreaValues", async (req, res) => {
  try {
    // Retrieve the datetime values from the query string
    const zip = req.query.zip;
    const min = req.query.min;
    const max = req.query.max;
    console.log("Server Received zip:", zip);
    console.log("Server Received min area:", min);
    console.log("Server Received max area:", max);
    // get front page for zip with area as above

    const selected = await getDataByAreaAndZip(zip, min, max);
    // Log the received datetime values
    console.log("selected ", selected);

    res.status(200).json({ message: selected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/fromDateTime", async (req, res) => {
  try {
    // Retrieve the datetime values from the query string
    const startDate = req.query.startDate;
    const state = req.query.val;
    // const val = req.query.val;
    const selected = await getRecordsAfterDateTime(
      collection,
      startDate,
      state
    );
    // Log the received datetime values
    // console.log('selected ', selected);
    console.log("Server Received Start Date:", startDate);
    console.log("Server Received Val/state:", state);

    // console.log('Received End Date:', endDate);

    // You can also use these datetime values for further processing as needed

    // Send a response (optional)
    res.status(200).json({ message: selected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/getAgent", async (req, res) => {
  try {
    const url = req.body.val;
    const html = await myFunctions.getHTMLWithScrapingant2(url);
    const agentStr = await parseAgentdata(html);
    console.log("o ", agentStr);

    res.status(200).json({ message: agentStr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/getAPN", async (req, res) => {
  try {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const response = await parcelFact.getOneAPN(lat, lon);
    console.log(response);
    res.status(200).json({ message: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/getAgent", async (req, res) => {
  try {
    const url = req.body.val;
    const html = await myFunctions.getHTMLWithScrapingant2(url);
    const agentStr = await parseAgentdata(html);
    console.log("o ", agentStr);

    res.status(200).json({ message: agentStr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/land", async (req, res) => {
  try {
    let collection = database.collection("landcomwisconsin");
    await runlandcom(collection);
    await client.close();
    res.status(200).json("completed!!!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log("Server started on port 3000"));
