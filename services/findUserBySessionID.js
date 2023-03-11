const { ObjectId } = require("mongodb");
const getDb = require("./db");

const findUserBySessionID = async (sessionId) => {
  const db = await getDb();
  const session = await db.collection("sessions").findOne(
    { sessionId },
    {
      projection: { userId: 1 }
    }
  );

  if (!session) {
    return;
  }
  const user = await db.collection("users").findOne(
    { _id: new ObjectId(session.userId) },
    {
      projection: {
        _id: 0,
        id: "$_id",
        username: 1,
      }
    }
  );
  if (user) user.id = user.id.toString();
  return user;
};

module.exports = findUserBySessionID;
