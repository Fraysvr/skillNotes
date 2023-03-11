const getDb = require("./db");

const findUserBySocialId = async (id) => {
  const db = await getDb();
  const user = await db.collection("users").findOne(
    { socialNetworkId: id },
    {
      projection: {
        _id: 0,
        id: "$_id",
        username: 1,
        email: 1,
        socialNetwork: 1,
      },
    }
  );
  if (user) user.id = user.id.toString();
  return user;
};

module.exports = findUserBySocialId;
