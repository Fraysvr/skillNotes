const getDb = require("./db");
const { ObjectId } = require("mongodb");
const marked = require("marked");

const findNoteByNoteId = async (userId, noteId) => {
  const db = await getDb();
  const note = await db.collection("usersNotes").findOne(
    {
      userId: userId,
      _id: new ObjectId(noteId),
    },
    {
      projection: { _id: 1, userId: 0 },
    }
  );
  if (note) {
    note.html = marked.parse(note.text);
    note._id = note._id.toString();
  }
  return note;
};

module.exports = findNoteByNoteId;
