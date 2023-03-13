const getDb = require("./db");

const findNotesByUserId = async (userId, age, search = "", page = 1) => {
  if (age === "alltime") {
    const notes = await getDataNotes(
      {
        userId: userId,
        isArchived: false,
        title: { $regex: search, $options: "i" },
      },
      page,
      search
    );
    return notes;
  } else if (age === "archive") {
    const notes = await getDataNotes(
      {
        userId: userId,
        isArchived: true,
        title: { $regex: search, $options: "i" },
      },
      page,
      search
    );
    return notes;
  } else {
    const date = formatSearchMonth(age);
    const notes = await getDataNotes(
      {
        userId: userId,
        title: { $regex: search, $options: "i" },
        created: { $gte: date },
        isArchived: false,
      },
      page,
      search
    );
    return notes;
  }
};

async function getDataNotes(find, page, search) {
  const db = await getDb();
  const limit = 20;
  const startIndex = (page - 1) * limit;
  const notes = await db.collection("usersNotes").find(find).sort({ _id: -1 }).skip(startIndex).limit(limit).toArray();

  if(search !== '') {
    notes.forEach((note) => {
      if (note.title.toLowerCase().includes(search.toLowerCase())) {
        const regex = new RegExp(search, "gi");
        note.highlights = note.title.replace(regex, (match) => `<strong>${match}</strong>`);
      }
    });
  }
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
