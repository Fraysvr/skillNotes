const getDb = require("./db");
const { ObjectId } = require("mongodb");

const deleteNote = async (userId, id) => {
  const db = await getDb();
  const note = await db.collection("usersNotes").findOneAndDelete(
    { _id: new ObjectId(id), userId: userId },
    { projection: { userId: 0 } }
  );
  return note.value;
};

module.exports = deleteNote;
