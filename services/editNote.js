const getDb = require("./db");
const { ObjectId } = require("mongodb");

const editNote = async (userId, id, title, text) => {
  const db = await getDb();
  return await db.collection("usersNotes").findOneAndUpdate(
    { _id: new ObjectId(id), userId: userId },
    {
      $set: {
        title: title,
        text: text
      }
    }, {
      returnDocument: 'after'
    }
  );
};

module.exports = editNote;
