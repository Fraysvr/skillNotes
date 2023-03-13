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
const PDFDocument = require("pdfkit");
const { Readable } = require("stream");
const path = require("path");

const router = express.Router();
router.post("/get", auth(), needAuth(), async (req, res) => {
  const notes = await findNotesByUserId(req.user.id, req.body.age, req.body.search, req.body.page);
  console.log(req.body.search);
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
  if (!notes) {
    return res.status(404).json({});
  }

  return res.json(notes);
});

router.get("/:id/pdf", auth(), needAuth(), async (req, res) => {
  const notes = await findNoteByNoteId(req.user.id, req.params.id);
  if (!notes) {
    return res.status(404).json({});
  }
  const doc = new PDFDocument({
    bufferPages: true,
    margin: { top: 72, bottom: 72, left: 72, right: 36 },
  });

  res.setHeader("Content-disposition", `attachment; filename=${notes.title}.pdf`);
  res.setHeader("Content-type", "application/pdf");

  const chunks = [];

  doc.on("data", (chunk) => {
    chunks.push(chunk);
  });

  doc.on("end", () => {
    const stream = Readable.from(chunks);
    stream.pipe(res);
  });

  doc
    .font(path.join(__dirname, "../views/fonts/Roboto-Bold.ttf"))
    .fontSize(16)
    .text(notes.title, {
      align: "center",
      underline: true,
    })
    .moveDown();

  doc.font(path.join(__dirname, "../views/fonts/Roboto-Regular.ttf")).fontSize(14).text(notes.text, {
    align: "justify",
    indent: 72,
  });

  doc.end();
});

module.exports = router;
