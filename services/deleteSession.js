const getDb  = require("./db");

const deleteSession = async (sessionId) => {
  const db = await getDb();
  await db.collection("sessions").deleteOne({ sessionId });
};

module.exports = deleteSession;
