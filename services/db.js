const { MongoClient } = require("mongodb");
let db = null;

async function getDb() {
  if (!db) {
    const clientPromise = await MongoClient.connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      maxPoolSize: 10
    });
    console.log("Connected to MongoDB");
    db = clientPromise.db("notes");
  }

  return db;
}

module.exports = getDb;
