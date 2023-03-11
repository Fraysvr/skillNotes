const getDb = require("./db");
const { ObjectId } = require("mongodb");

const archiveNote = async (userId, id, archive) => {
  const db = await getDb();
  const note = await db.collection("usersNotes").findOneAndUpdate(
    { _id: new ObjectId(id), userId: userId, isArchived: archive },
    {
      $set: {
        isArchived: !archive,
      }
    },
    { returnDocument: "after" }
  );
  return note.value;
};

module.exports = archiveNote;
