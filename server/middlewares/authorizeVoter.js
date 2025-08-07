module.exports = (req, res, next) => {
    if (req.user.role !== 'voter') {
      return res.status(403).json({ message: 'Access denied: Voter only' });
    }
    next();
  };
  