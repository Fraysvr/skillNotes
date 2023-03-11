const auth = require("../middlewares/auth");
const express = require("express");
const redirectToIndex = require("../middlewares/redirectToIndex");
const deleteSession = require("../services/deleteSession");

const router = express.Router();

router.get("/", auth(), redirectToIndex(), async (req, res) => {
  await deleteSession(req.sessionId);
  res.clearCookie("sessionId").redirect("/");
});

module.exports = router;
