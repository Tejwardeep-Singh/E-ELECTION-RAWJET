const { JWT_KEY } = require('../config/keys');
const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { userId, password } = req.body;
  const admin = await Admin.findOne({ userId });
  if (!admin) return res.status(401).send("Invalid ID");

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).send("Invalid password");

  const token = jwt.sign({ role: 'admin', userId },JWT_KEY, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
