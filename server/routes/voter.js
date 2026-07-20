const { JWT_KEY } = require('../config/keys.js');
const express = require('express');
const router = express.Router();
const Voter = require('../models/voter');
const Candidate = require('../models/candidate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { voterUpload } = require("../config/cloudinaryUpload");

const uploadVoterImage = (req, res, next) => {

  voterUpload.single("photoUrl")(req, res, (error) => {

    console.log("After multer");

    if (error) {
      console.error(error);
      return res.status(400).json({
        message: error.message
      });
    }

    console.log(req.file);
    next();
  });
};

const parseAddress = (value) => {
  if (typeof value === 'string') {
    return JSON.parse(value);
  }
  return value;
};

const getUploadedImageUrl = (file) => file?.path || file?.secure_url;

// Register voter
router.post('/register', uploadVoterImage, async (req, res) => {
  try {
    const { epicNumber, userId, name, password } = req.body;
    const address = parseAddress(req.body.address);
    const normalizedEpicNumber = epicNumber?.trim().toUpperCase();
    const photoUrl = getUploadedImageUrl(req.file);

    if (!normalizedEpicNumber || !userId || !name || !password || !address?.area) {
      return res.status(400).json({ message: 'Please provide all required voter details' });
    }

    const existing = await Voter.findOne({ $or: [{ epicNumber: normalizedEpicNumber }, { userId }] });
    if (existing) return res.status(400).json({ message: 'Voter already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVoter = new Voter({
      epicNumber: normalizedEpicNumber,
      userId,
      name,
      address,
      password: hashedPassword,
      photoUrl: photoUrl || ''
    });

    await newVoter.save();
    res.status(201).json({ message: 'Voter registered successfully' });
  } catch (err) {
    console.error('Error registering voter:', err);
    if (err instanceof SyntaxError || err.name === 'ValidationError' || err.code === 11000) {
      return res.status(400).json({ message: err.code === 11000 ? 'Voter already exists' : err.message });
    }
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
  router.post('/vote/:candidateId', authenticateVoter, async (req, res) => {
    try {
      const voter = await Voter.findById(req.voterId);
      if (!voter || voter.votingStatus === 'voted') {
        return res.status(400).json({ message: 'You have already voted' });
      }
  
      const candidate = await Candidate.findById(req.params.candidateId);
      if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
  
      candidate.voteCount = (candidate.voteCount || 0) + 1;
      await candidate.save();
  
      voter.votingStatus = 'voted';
      await voter.save();
  
      res.json({ message: 'Vote recorded successfully', votingStatus: voter.votingStatus });
    } catch (err) {
      console.error('Error during vote:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
router.get('/results', authenticateVoter, async (req, res) => {
  try {
    const voter = await Voter.findById(req.voterId);
    if (!voter) return res.status(404).json({ message: 'Voter not found' });

    const candidates = await Candidate.find({
      'address.state': voter.address.state,
      'address.city': voter.address.city,
      'address.area': voter.address.area,
    }).sort({ voteCount: -1 });

    res.json({ address: voter.address, candidates });
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put(
  '/update-photo',
  authenticateVoter,
  uploadVoterImage,

  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          message: "Profile image is required"
        });
      }

      const voter = await Voter.findById(req.voterId);

      if (!voter) {
        return res.status(404).json({
          message: "Voter not found"
        });
      }

      const photoUrl = getUploadedImageUrl(req.file);
      if (!photoUrl) {
        return res.status(500).json({ message: 'Profile image URL was not returned by storage' });
      }

      voter.photoUrl = photoUrl;

      await voter.save();

      res.json({
        message: "Photo updated successfully",
        photoUrl: voter.photoUrl
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message: "Server error"
      });
    }
});
module.exports = router;
