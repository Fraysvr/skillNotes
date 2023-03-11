const getDb = require("./db");

const findNotesByUserId = async (userId, age, search, page = 1) => {
  if (age === "alltime") {
    const notes = await getDataNotes(
      {
        userId: userId,
        isArchived: false,
      },
      page
    );
    return notes;
  } else if (age === "archive") {
    const notes = await getDataNotes(
      {
        userId: userId,
        isArchived: true,
      },
      page
    );
    return notes;
  } else {
    const date = formatSearchMonth(age);
    const notes = await getDataNotes(
      {
        userId: userId,
        created: { $gte: date },
        isArchived: false,
      },
      page
    );
    return notes;
  }
};

async function getDataNotes(find, page) {
  const db = await getDb();
  const limit = 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit - 1;
  const notes = await db.collection("usersNotes").find(find).sort({ _id: -1 }).skip(startIndex).limit(limit).toArray();
  return notes;
}

function formatSearchMonth(age) {
  const date = new Date();
  let time = 0;
  switch (age) {
    case "1month":
      time = 1;
      break;
    case "3months":
      time = 3;
      break;
  }
  date.setMonth(date.getMonth() - time);
  return date;
}

module.exports = findNotesByUserId;
