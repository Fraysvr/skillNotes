const getDb = require("./db");

const createNote = async (userId, title, text) => {
  const db = await getDb();
  const note = {
    userId: userId,
    title: title,
    text: text,
    created: new Date(),
    isArchived: false
  };
  await db.collection("usersNotes").insertOne(note);
  return note;
};

module.exports = createNote;
