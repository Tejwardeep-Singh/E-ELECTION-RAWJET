const loadAdmin = require('./loadAdmin');

module.exports = (req, res, next) => {
  if (req.user.role === 'head') return next();
  return loadAdmin(req, res, next);
};
