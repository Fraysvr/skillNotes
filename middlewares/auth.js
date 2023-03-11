const findUserBySessionID = require("../services/findUserBySessionID");
const auth = () => async (req, res, next) => {
  if (!req.cookies["sessionId"]) {
    return next();
  }
  req.user = await findUserBySessionID(req.cookies["sessionId"]);
  req.sessionId = req.cookies["sessionId"];
  next();
};

module.exports = auth;
