const Admin = require('../models/admin');

module.exports = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }

  try {
    const admin = await Admin.findOne({ userId: req.user.userId }).select('-password');
    if (!admin || !admin.electionId || !admin.constituencyId) {
      return res.status(403).json({ message: 'Admin jurisdiction is not configured' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};
