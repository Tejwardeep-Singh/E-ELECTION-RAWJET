const { JWT_KEY } = require('../config/keys.js');
const express = require('express');
const router = express.Router();
const Voter = require('../models/voter');
const Candidate = require('../models/candidate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register voter
router.post('/register', async (req, res) => {
  const { epicNumber, userId, name, area, password,city,state } = req.body;

  try {
    const existing = await Voter.findOne({ $or: [{ epicNumber }, { userId }] });
    if (existing) return res.status(400).json({ message: 'Voter already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVoter = new Voter({
      epicNumber,
      userId,
      name,
      area,
      city,
      state,
      password: hashedPassword,
    });

    await newVoter.save();
    res.status(201).json({ message: 'Voter registered successfully' });
  } catch (err) {
    console.error('Error registering voter:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
    const { userId, password } = req.body;
  
    try {
      const voter = await Voter.findOne({ userId });
      if (!voter) return res.status(401).json({ message: 'Invalid user ID' });
  
      const isMatch = await bcrypt.compare(password, voter.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });
  
      const token = jwt.sign({ role:"voter", voterId: voter._id }, JWT_KEY, { expiresIn: '2h' });
      res.json({ token, voterId: voter._id });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  function authenticateVoter(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token, JWT_KEY);
      req.voterId = decoded.voterId;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
  
  // ✅ 1. Get voter details (Dashboard)
  router.get('/me', authenticateVoter, async (req, res) => {
    try {
      const voter = await Voter.findById(req.voterId).select('-password');
      if (!voter) return res.status(404).json({ message: 'Voter not found' });
      res.json(voter);
    } catch (err) {
      console.error('Error fetching voter:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // ✅ 2. Cast vote
  router.post('/vote/:candidateId', authenticateVoter, async (req, res) => {
    try {
      const voter = await Voter.findById(req.voterId);
      if (!voter || voter.hasVoted) {
        return res.status(400).json({ message: 'You have already voted' });
      }
  
      const candidate = await Candidate.findById(req.params.candidateId);
      if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
  
      candidate.voteCount = (candidate.voteCount || 0) + 1;
      await candidate.save();
  
      voter.hasVoted = true;
      await voter.save();
  
      res.json({ message: 'Vote recorded successfully' });
    } catch (err) {
      console.error('Error during vote:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
router.get('/results', authenticateVoter, async (req, res) => {
  try {
    const voter = await Voter.findById(req.voterId);
    if (!voter) return res.status(404).json({ message: 'Voter not found' });

    const candidates = await Candidate.find({ area: voter.area }).sort({ voteCount: -1 });

    res.json({ area: voter.area, candidates });
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
