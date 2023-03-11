const express = require("express");
const bodyParser = require("body-parser");
const findUserByUsername = require("../services/findUserByUsername");
const createNewUser = require("../services/createNewUser");
const router = express.Router();


router.post(
  "/",
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const { username, password } = req.body;
    const checkUsername = await findUserByUsername(username);
    if (checkUsername) {
      return res.redirect("/?signupError=true");
    }
    await createNewUser(username, password);
    return res.redirect("/?signupSuccess=true");
  }
);

module.exports = router;
