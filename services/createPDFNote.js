const PDFDocument = require("pdfkit");
const { Readable } = require("stream");
const path = require("path");
const transliteration = require("transliteration").slugify;

function createPDFNote(note, res) {
  const doc = new PDFDocument({
    bufferPages: true,
    margin: { top: 72, bottom: 72, left: 72, right: 36 },
  });

  res.setHeader("Content-disposition", `attachment; filename=${transliteration(note.title)}.pdf`);
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
    .text(note.title, {
      align: "center",
      underline: true,
    })
    .moveDown();

  doc.font(path.join(__dirname, "../views/fonts/Roboto-Regular.ttf")).fontSize(14).text(note.text, {
    align: "justify",
    indent: 72,
  });

  doc.end();
}

module.exports = createPDFNote;
