const express = require("express");
const auth = require("../middlewares/auth");
const needAuth = require("../middlewares/needAuth");
const findNotesByUserId = require("../services/findNotesByuserId");
const createNote = require("../services/createNote");
const findNoteByNoteId = require("../services/findNoteByNoteId");
const editNote = require("../services/editNote");
const archiveNote = require("../services/archiveNote");
const deleteNote = require("../services/deleteNote");
const deleteAllArchivedNote = require("../services/deleteAllArchivedNotes");

const router = express.Router();
router.post("/get", auth(), needAuth(), async (req, res) => {
  const notes = await findNotesByUserId(req.user.id, req.body.age, req.body.search, req.body.page);
  if (!notes) {
    return res.json({ data: [] });
  }
  const notesArrayLength = notes.length >= 20 ? notes.length : 0;
  return res.json({ data: notes, hasMore: notesArrayLength });
});

router.post("/", auth(), needAuth(), async (req, res) => {
  const newNote = await createNote(req.user.id, req.body.title, req.body.text);
  res.json(newNote);
});

router.get("/:id", auth(), needAuth(), async (req, res) => {
  const note = await findNoteByNoteId(req.user.id, req.params.id);
  if (!note) {
    return res.status(404).json({});
  }
  return res.json(note);
});

router.post("/:id", auth(), needAuth(), async (req, res) => {
  const note = await findNoteByNoteId(req.user.id, req.params.id);
  if (!note) {
    return res.status(404).json({});
  }
  return res.json(editNote(req.user.id, req.params.id, req.body.title, req.body.text));
});

router.patch("/:id/archiveNote", auth(), needAuth(), async (req, res) => {
  const note = await findNoteByNoteId(req.user.id, req.params.id);
  if (!note) {
    return res.status(404).json({});
  }
  return res.json(archiveNote(req.user.id, req.params.id, req.body.archived));
});

router.delete("/:id/delete", auth(), needAuth(), async (req, res) => {
  const note = await findNoteByNoteId(req.user.id, req.params.id);
  if (!note) {
    return res.status(404).json({});
  }
  return res.json(deleteNote(req.user.id, req.params.id));
});

router.delete("/deleteAllArchived", auth(), needAuth(), async (req, res) => {
  const notes = await deleteAllArchivedNote(req.user.id);
  console.log(notes);
  if (!notes) {
    return res.status(404).json({});
  }

  return res.json(notes);
});

module.exports = router;
