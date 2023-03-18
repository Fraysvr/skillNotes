const findNoteByNoteId = require("../services/findNoteByNoteId");
const findNote = () => async (req, res, next) => {
  const note = await findNoteByNoteId(req.user.id, req.params.id);
  if (!note) {
    return res.status(404).json({});
  }
  req.note = note;
  next();
};

module.exports = findNote;
