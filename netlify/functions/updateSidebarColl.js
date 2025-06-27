require("dotenv").config();
const { MongoClient } = require("mongodb");
var murl = process.env.MONGODB_URI;
const client = new MongoClient(murl);
client.connect();
const database = client.db("mydata");
// let collection = database.collection("bucket1");
let firstNum = 0;
let lastNum = 3;
let myArgs = process.argv.slice(2);
console.log(myArgs);

async function upsertToBucket(coll, objArr) {
  for (let i = 0; i < objArr.length; i++) {
    const obj = objArr[i];
    // Use listing_id as the unique identifier in the filter.
    const filter = { listing_id: obj.listing_id };
    try {
      const result = await coll.updateOne(
        filter,
        { $set: obj },
        { upsert: true }
      );
      if (result.upsertedCount > 0) {
        console.log(
          `Upsert created a new listing with id: ${result.upsertedId._id}`
        );
      } else if (result.modifiedCount > 0) {
        console.log(`Updated listing with listing_id: ${obj.listing_id}`);
      } else {
        console.log(`No changes made for listing_id: ${obj.listing_id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

exports.handler = async function (event, context) {
  // Parse the incoming JSON body
  const body = JSON.parse(event.body);

  // Extract chat history and image file info
  const chatHistory = body.chatHistoryJson; // Array of chat messages
  const imageFile = body.imageFile;         // { name, data (base64 string) }

  // Example: log for debugging
  console.log("Chat History:", chatHistory);
  console.log("Image File Name:", imageFile?.name);
  console.log("Image File Data Length:", imageFile?.data?.length);

  // Prepare the record to store in MongoDB
  const record = {
    chatHistory: chatHistory,
    imageFile: {
      name: imageFile?.name,
      data: imageFile?.data, // You may want to store as-is, or process further
      uploadedAt: new Date()
    }
  };

  // Choose your collection (hardcoded or from body, as needed)
  let collection = database.collection("your_collection_name");

  // Insert the record
  const result = await collection.insertOne(record);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Record stored",
      insertedId: result.insertedId,
    }),
  };
};
