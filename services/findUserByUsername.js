const getDb = require("./db");

const findUserByUsername = async (username) => {
  const db = await getDb();
  const user = await db.collection("users").findOne(
    { username },
    {
      projection: {
        _id: 0,
        id: "$_id",
        username: 1,
        password: 1
      }
    }
  );
  if (user) user.id = user.id.toString();
  return user;
};

module.exports = findUserByUsername;
