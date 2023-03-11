const getDb = require("./db");

const deleteAllArchivedNote = async (userId, id) => {
  const db = await getDb();
  const note = await db
    .collection("usersNotes")
    .deleteMany({ userId: userId, isArchived: true }, { projection: { userId: 0 } });
  return { message: `${note.deletedCount}  note(s) deleted.` };
};

module.exports = deleteAllArchivedNote;
