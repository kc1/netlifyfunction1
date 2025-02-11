require("dotenv").config();
// console.log(process.env) // remove this after you've confirmed it is working
const { MongoClient } = require("mongodb");
// var murl = "mongodb://localhost:27017/"
var murl = process.env.MONGODB_URI;
const client = new MongoClient(murl);
client.connect();
const database = client.db("mydata");
let collection = database.collection("bucket1");
let ignorethiszz;
let firstNum = 0;
let lastNum = 3;
let myArgs = process.argv.slice(2);
console.log(myArgs);

async function pushToBucket(coll, objArr) {

  for (let i = 0; i < objArr.length; i++) {
    const obj = objArr[i];
    const result = await coll.insertOne(obj);
    console.log(
      `${result.insertedCount} new listing created with the following id: ${result.insertedId}`
    );
  }
}

exports.handler = async function (event, context) {
  const myObjArray = JSON.parse(event.body);
  //   const url = obj.val;
  //   const st = obj.st;
  console.log(myObjArray);

  const data = await pushToBucket(collection, myObjArray);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: myObjArray,
    }),
  };
};
