const { JWT_KEY } = require('../config/keys');
const express = require('express');
const router = express.Router();
const Head = require('../models/head');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { userId, password } = req.body;
  const head = await Head.findOne({ userId });
  if (!head) return res.status(401).send("Invalid ID");

  const valid = await bcrypt.compare(password, head.password);
  if (!valid) return res.status(401).send("Invalid password");
  const token = jwt.sign({ role: 'head', userId: head.userId },JWT_KEY, { expiresIn: '1h' });
    if (!token) return res.status(500).send("Error generating token");
    res.json({ token });
});

module.exports = router;
