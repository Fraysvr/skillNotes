const redirectToDashboard = () => async (req, res, next) => {
  if (!req.user) {
    return next();
  }
  return res.redirect('/dashboard');
};

module.exports = redirectToDashboard;
