require("dotenv").config();
const { MongoClient } = require("mongodb");
const { ChatOpenAI } = require("@langchain/openai");

// MongoDB setup
const murl = process.env.MONGODB_URI;
const client = new MongoClient(murl);
let database;
let isConnected = false;

async function getDatabase() {
  if (!isConnected) {
    await client.connect();
    database = client.db("mydata");
    isConnected = true;
  }
  return database;
}

// Helper: fetch documents from MongoDB
async function fetchMongoDBData(filterObj, collName) {
  const db = await getDatabase();
  const collection = db.collection(collName);
  return await collection.find(filterObj).toArray();
}

// Helper: callOpenRouter2 (stub, replace with your actual implementation)
async function callOpenRouter2(newfile, combinedPrompt) {
  // Implement your LLM/image API call here
  return { status: "stub", prompt: combinedPrompt, file: newfile?.name };
}

const llm = new ChatOpenAI({
  openAIApiKey: "sk-or-...", // your OpenRouter key
  openAIApiBase: "https://openrouter.ai/api/v1", // OpenRouter endpoint
  modelName: "meta-llama/llama-4-maverick", // or any model OpenRouter supports
});

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Parse incoming JSON
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { newfile, prompt, coll = "contextThreads", topicId = "test" } = body;

  // 1. Query MongoDB for context chats with topicId
  const filterObj = { topicId };
  let contextDocs = [];
  try {
    contextDocs = await fetchMongoDBData(filterObj, coll);
  } catch (e) {
    return { statusCode: 500, body: "MongoDB query failed" };
  }

  // 2. Extract and combine chat histories
  let contextMessages = [];
  if (Array.isArray(contextDocs)) {
    contextDocs.forEach(doc => {
      if (Array.isArray(doc.history)) {
        contextMessages = contextMessages.concat(doc.history);
      } else if (Array.isArray(doc.chat_history)) {
        contextMessages = contextMessages.concat(doc.chat_history);
      }
    });
  }

  // 3. Combine context with the new prompt
  let combinedPrompt = "";
  contextMessages.forEach(msg => {
    if (msg.data && msg.data.content) {
      combinedPrompt += msg.data.content + "\n";
    } else if (msg.content) {
      combinedPrompt += msg.content + "\n";
    }
  });
  combinedPrompt += prompt;

  // 4. Send the image and combined prompt to the LLM
  let llmResponse;
  try {
    llmResponse = await callOpenRouter2(newfile, combinedPrompt);
  } catch (e) {
    return { statusCode: 500, body: "LLM call failed" };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "LLM response",
      llmResponse
    }),
    headers: { "Content-Type": "application/json" }
  };
};