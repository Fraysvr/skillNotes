const { nanoid } = require("nanoid");
const getDb  = require("./db");

const createSession = async (userId) => {
  const db = await getDb();
  const sessionId = nanoid();
  await db.collection("sessions").insertOne({ userId, sessionId });

  return sessionId;
};

module.exports = createSession;
