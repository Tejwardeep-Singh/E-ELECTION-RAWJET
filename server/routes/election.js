const { JWT_KEY } = require('../config/keys.js');
const express = require('express');
const router = express.Router();
const Voter = require('../models/voter');
const Candidate = require('../models/candidate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ElectionConfig = require('../models/elections');
const moment = require('moment-timezone'); 


// Get election live status
router.get('/status', async (req, res) => {
  try {
    const config = await ElectionConfig.findOne();
    if (!config) return res.json({ electionLive: false, resultVisible: false });

    // Make all three moment objects
    const now = moment().tz('Asia/Kolkata');
    const startTime = moment.tz(config.startTime, 'Asia/Kolkata');
    const endTime = moment.tz(config.endTime, 'Asia/Kolkata');

    const electionLive = now.isBetween(startTime, endTime);

    // 🔁 Automatically update DB if election ended and result not visible yet
    if (now.isAfter(endTime) && !config.resultVisible) {
      config.electionLive = false;
      await config.save();
    }

    res.json({
      electionLive,
      resultVisible: config.resultVisible,
      startTime: config.startTime,
      endTime: config.endTime
    });
  } catch (err) {
    console.error('Election status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get election config
router.get('/get', async (req, res) => {
  try {
    const election = await ElectionConfig.findOne();
    res.json(election);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch election timings' });
  }
});
router.get('/timer', async (req, res) => {
  try {

    const config = await ElectionConfig.findOne();

    if (!config) {
      return res.status(404).json({
        message: 'Election config not found'
      });
    }

    const now = moment().tz('Asia/Kolkata');

    const startTime = moment.tz(config.startTime, 'Asia/Kolkata');

    const endTime = moment.tz(config.endTime, 'Asia/Kolkata');

    const electionLive = now.isBetween(startTime, endTime);

    const timeRemaining = electionLive
      ? Math.max(0, endTime.diff(now))
      : 0;

    let status = 'reset';

if (config.resultVisible) {

  status = 'resultLive';

} else if (electionLive) {

  status = 'live';

} else if (now.isBefore(startTime)) {

  status = 'upcoming';

} else if (now.isAfter(endTime)) {

  status = 'ended';

}

    // Auto update
    if (now.isAfter(endTime) && !config.resultVisible) {
      config.electionLive = false;
      await config.save();
    }

    res.json({
      status,
      timeRemaining,
      electionLive,
      resultVisible: config.resultVisible,
      startTime: config.startTime,
      endTime: config.endTime
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Server error'
    });

  }
});
module.exports = router;
