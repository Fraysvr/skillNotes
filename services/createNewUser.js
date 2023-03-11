const getDb = require("./db");
const hash = require("./passwordHash");

const createNewUser = async (username, password, socialNetwork = 'none', socialNetworkId = 'none', email = 'none') => {
  const db = await getDb();
  const newUser = await db.collection("users").insertOne({ username,
    password: hash(password),
    socialNetwork,
    socialNetworkId,
    email });
  return { username: username, id: newUser.insertedId.toString(), socialNetwork, socialNetworkId, email };
};

module.exports = createNewUser;
