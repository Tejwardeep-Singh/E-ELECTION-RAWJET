const { JWT_KEY } = require('../config/keys.js');
const express = require('express');
const router = express.Router();
const Voter = require('../models/voter');
const Candidate = require('../models/candidate');
const Head = require('../models/head');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ElectionConfig = require('../models/elections');

// Common route for results
router.get('/', async (req, res) => {
    try {
      const config = await ElectionConfig.findOne({});
      if (!config || !config.resultVisible) {
        return res.status(403).json({ message: 'Results not yet visible' });
      }
  
      const userRole = req.query.role; // 'voter', 'admin', 'head'
      const area = req.query.area; // Only for voters
  
      let candidates;
  
      if (userRole === 'voter') {
        if (!area) return res.status(400).json({ message: 'Area required for voters' });
        candidates = await Candidate.find({ area }).sort({ voteCount: -1 });
      } else {
        candidates = await Candidate.find().sort({ area: 1, voteCount: -1 });
      }
  
      res.json(candidates);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching results' });
    }
  });
  
module.exports=router;