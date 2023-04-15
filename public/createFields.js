// fields that need to be created: address, city, state, zip

const fetch = require('node-fetch');
const { extract } = require('extract-us-city');

const {
  MongoClient
} = require("mongodb");
var murl = "mongodb://localhost:27017/local";
const client = new MongoClient(murl);
client.connect();
const database = client.db("mydata");
const collection = database.collection("coll3");
let firstNum = 3;
let APNs = [];
let FAILED = [];
let myArgs = process.argv.slice(2);
console.log(myArgs);
if (myArgs && myArgs[0] && (parseInt(myArgs[0])) != NaN) {
  console.log(myArgs);
  firstNum = parseInt(myArgs[0]);
}
console.log(firstNum);



async function getRecords(firstNum) {
  const filter = { "MAILCITY": { $exists: false } };
  let records = await collection.find(filter).limit(firstNum).toArray();
  console.log('number of records selected from db: ', records.length);
  return records;

}


async function run() {

  var begin = Date.now();
  const records = await getRecords(firstNum);
  // get records
  // console.log(records);


  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    let mailLines = [];
    let myObj = {};
    mailLines.push(record.Mail2);
    mailLines.push(record.Mail3);
    mailLines.push(record.Mail4);
    mailLines.push(record.Mail5);
    try {
      let csLine;
      let blank = true;
      while (mailLines.length > 0 && blank == true) {
        const ml = mailLines.pop();
        if (ml.length > 0) {
          csLine = ml;
          blank = false;
        }
      }
      let csArray = csLine.split(" ");
      myObj.MAILSTATE = csArray.pop().trim();
      myObj.MAILCITY = csArray.join(' ');
      // myObj.MAILADDRESS = mailLines.join(",");
      myObj.MAILADDRESS = mailLines.pop();
      myObj.MAILZIP = record.zip;
      await collection.updateOne({ "Parcel": record.Parcel }, { $set: myObj });
      APNs.push(record.Parcel);


    } catch (error) {
      console.log(error);
      FAILED.push(record.Parcel);
    }
  }
  console.log('completed APNs:');
  console.log(APNs);
  console.log(FAILED);
  var end = Date.now();
  console.log((end - begin) / 60000 + " minutes");



}
run();

// notes: 0071 (VACANT INCOMPLETE URBAN SUBDIVIDED)


