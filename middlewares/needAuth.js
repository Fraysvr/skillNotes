const needAuth = () => async (req, res, next) => {
  if (!req.user) {
    return res.status(401);
  }
  next();
};

module.exports = needAuth;
