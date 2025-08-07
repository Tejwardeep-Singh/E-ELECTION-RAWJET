const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config/keys');

// Middleware to authenticate Head/Admin/Voter based on token
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_KEY);
    req.user = decoded; // contains role and userId
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
