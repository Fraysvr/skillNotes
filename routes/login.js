const express = require("express");
const bodyParser = require("body-parser");
const findUserByUsername = require("../services/findUserByUsername");
const createSession = require("../services/createSession");
const hash = require("../services/passwordHash");

const router = express.Router();

router.post("/", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user || user.password !== hash(password)) {
    return res.redirect("/?authError=true");
  }
  const sessionId = await createSession(user.id);
  res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/dashboard");
});

module.exports = router;
