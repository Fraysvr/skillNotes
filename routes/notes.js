const express = require("express");
const auth = require("../middlewares/auth");
const needAuth = require("../middlewares/needAuth");
const findNote = require("../middlewares/findNote");
const findNotesByUserId = require("../services/findNotesByuserId");
const createNote = require("../services/createNote");
const editNote = require("../services/editNote");
const archiveNote = require("../services/archiveNote");
const deleteNote = require("../services/deleteNote");
const deleteAllArchivedNote = require("../services/deleteAllArchivedNotes");
const createPDFNote = require("../services/createPDFNote");

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

router.get("/:id", auth(), needAuth(), findNote(), async (req, res) => {
  return res.json(req.note);
});

router.post("/:id", auth(), needAuth(), findNote(), async (req, res) => {
  return res.json(editNote(req.user.id, req.params.id, req.body.title, req.body.text));
});

router.patch("/:id/archiveNote", auth(), needAuth(), findNote(), async (req, res) => {
  return res.json(archiveNote(req.user.id, req.params.id, req.body.archived));
});

router.delete("/:id/delete", auth(), needAuth(), findNote(), async (req, res) => {
  return res.json(deleteNote(req.user.id, req.params.id));
});

router.delete("/deleteAllArchived", auth(), needAuth(), async (req, res) => {
  const notes = await deleteAllArchivedNote(req.user.id);
  if (!notes) {
    return res.status(404).json({});
  }

  return res.json(notes);
});

router.get("/:id/pdf", auth(), needAuth(), findNote(), async (req, res) => {
  createPDFNote(req.note, res);
});

module.exports = router;
