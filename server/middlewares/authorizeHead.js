module.exports = (req, res, next) => {
    if (req.user.role !== 'head') {
      return res.status(403).json({ message: 'Access denied: Head only' });
    }
    next();
  };
  