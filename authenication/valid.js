const valid = (req, res, next) => {
  const token = req.header("Authentication");
  req.token = token;
  next();
};

module.exports = valid;
