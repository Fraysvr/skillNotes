const auth = require("../middlewares/auth");
const express = require("express");
const redirectToIndex = require("../middlewares/redirectToIndex");
const deleteSession = require("../services/deleteSession");

const router = express.Router();

router.use((req, res) => {
  res.status(404).render("error", {
    message: "Page not found",
  });
})

module.exports = router;
