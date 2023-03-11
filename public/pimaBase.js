const fetch = require('node-fetch');
const {
  MongoClient
} = require("mongodb");
var murl = "mongodb://localhost:27017/local";
const client = new MongoClient(murl);
client.connect();
const database = client.db("mydata");
const collection = database.collection("pima2");
let firstNum = 1;
let APNs = [];
let myArgs = process.argv.slice(2);
console.log(myArgs);
if (myArgs && myArgs[0] && (parseInt(myArgs[0])) != NaN) {
  console.log(myArgs);
  firstNum = parseInt(myArgs[0]);
}
console.log(firstNum);

async function buildURL(apn) {

  const scb = apn.slice(0, 3);
  const scm = apn.slice(3, 5);
  const scp = apn.slice(5);

  return `https://www.to.pima.gov/propertyInquiry/?stateCodeB=${scb}&stateCodeM=${scm}&stateCodeP=${scp}`;

}

async function getRecords(firstNum) {
  const filter = { "TOTAL DUE": { $exists: false }, 'UseCode': { $regex: /^00/ } };
  let records = await collection.find(filter).limit(firstNum).toArray();
  console.log('number of records selected from db: ', records.length);
  return records;

}

async function groupRecordsIntoSubarrays(records, perChunk) {

  // const perChunk = 10 // items per chunk    

  const result = records.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk)

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  console.log(result); // result: [['a','b'], ['c','d'], ['e']] 
  return result;
}

async function createFetchObjectArray(records) {

  const fetchURL = (obj) => fetch('https://joyful-zuccutto-8b8329.netlify.app/.netlify/functions/puppetPimaTaxes', {
  // const fetchURL = (obj) => fetch('http://localhost:8888/.netlify/functions/puppetPimaTaxes', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: { 'Content-Type': 'application/json' }
  });

  let outputArray = [];
  for (let i = 0; i < (records.length); i++) {
    const record = records[i];
    const obj = { "apn": record.Parcel };
    const fetchObj = fetchURL(obj);
    outputArray.push(fetchObj);

  }

  return outputArray;

}

async function runParallel(promiseArray) {


  try {


    // const promiseArray = outputArray.map(obj => fetchURL(obj));
    const responses = await Promise.allSettled(promiseArray);
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (response.status == "fulfilled") {
        console.log(response);
        // const v = await response.value;
        // const j = await v.json();
        const j = await response.value.json();
        const m = j.message;
        console.log(m);
        await collection.updateOne({ "Parcel": m.apn }, { $set: m.myObj });
        // await collection.updateOne({ "Parcel": m.apn }, { $set: { "totalDue": m.totalDue } });
        const testURL = await buildURL(m.apn);
        APNs.push({[m.apn]:testURL});
        // await collection.updateOne({ "_id":ObjectId(m._id) }, { $set: { "UseCode": m.parcelUse, "long": m.long, "lat": m.lat, "LandSqFt": m.LandSqFt, 'PropType': m.PropType, "ParcelOwner": m.ParcelOwner, "Mail2": m.Mail2, "Mail3": m.Mail3, "Mail4": m.Mail4, "Mail5": m.Mail5, "zip": m.zip } });
        console.log(m);
      }
    }
  } catch (error) {
    console.log(error);
  }


}


async function run2() {

  var begin = Date.now();
  const records = await getRecords(firstNum);
  const groupedRecords = await groupRecordsIntoSubarrays(records, 2);
  console.log(groupedRecords);
  for (let i = 0; i < groupedRecords.length; i++) {
    const groupedRecord = groupedRecords[i];
    const fetchObjects = await createFetchObjectArray(groupedRecord);
    console.log('----------------------');
    console.log(fetchObjects);
    await runParallel(fetchObjects);
  }
  console.log('completed APNs:');
  console.log(APNs);
  var end = Date.now();
  console.log((end - begin) / 60000 + " minutes");
}

run2();

// notes: 0071 (VACANT INCOMPLETE URBAN SUBDIVIDED)



// async function run3() {


//   const filter = { 'Yearly': { $exists: false }, 'Owed': { $exists: false }, 'UseCode': { $regex: /^00/ } };

//   let records = await collection.find(filter).limit(firstNum).toArray()
//   console.log('number of records selected from db: ', records.length);

//   while (records.length) {
//     console.log('-----------------------------------------------------------');
//     // TotalPages:
//     const record = records.pop();
//     // const to = rn(400, 800);


//     // await sleep(to);

//     const apn = record.Parcel;
//     // const apn = '129050070';
//     console.log(apn);
//     const url = fetch(apn);
//     // const html = await fetchByAPN(apn);

//     const r = await url;
//     const body = await r.text()
//     console.log(body);
//   }

//   const perChunk = 2 // items per chunk    

//   const inputArray = ['a', 'b', 'c', 'd', 'e']

//   const result = inputArray.reduce((resultArray, item, index) => {
//     const chunkIndex = Math.floor(index / perChunk)

//     if (!resultArray[chunkIndex]) {
//       resultArray[chunkIndex] = [] // start a new chunk
//     }

//     resultArray[chunkIndex].push(item)

//     return resultArray
//   }, [])

//   console.log(result); // result: [['a','b'], ['c','d'], ['e']]





//   const fetchURL = (obj) => fetch('http://localhost:8888/.netlify/functions/puppetPimaTaxes.js', {
//     method: 'POST',
//     body: JSON.stringify(obj),
//     headers: { 'Content-Type': 'application/json' }
//   });
//   for (let i = 0; i < records.length; i++) {
//     const record = records[i];

//   }

  // const promiseArray = [URL1, URL2, URL3].map(fetchURL);
//   const promiseArray = result.map(fetchURL);
//   const output = await Promise.all(promiseArray);

//   await collection.updateOne({ _id: record._id }, { $set: { "UseCode": parcelUse, "long": long, "lat": lat, "LandSqFt": LandSqFt, 'PropType': PropType, "ParcelOwner": ParcelOwner, "Mail2": Mail2, "Mail3": Mail3, "Mail4": Mail4, "Mail5": Mail5, "zip": zip } });

// }

// run2();