const { JWT_KEY } = require('../config/keys.js');
const express = require('express');
const router = express.Router();
const Voter = require('../models/voter');
const Candidate = require('../models/candidate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ElectionConfig = require('../models/elections');
const moment = require('moment-timezone'); 
const Election = require("../models/election");
const syncElectionStatus = require("../services/syncElectionStatus");


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
router.get("/timer/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await Election.findById(electionId);

    if (!election) {
      return res.status(404).json({
        message: "Election not found",
      });
    }

    const now = new Date();

    const startDate = new Date(election.startDate);

    const endDate = new Date(election.endDate);

    // -------------------------
    // Automatic Status Updates
    // -------------------------

   if (
    election.status === "Active" &&
    now >= endDate
) {

    election.status = "Completed"
    await election.save();
}
    if (
      election.status === "Draft" &&
      now >= startDate &&
      now < endDate
    ) {
      election.status = "Active";
      await election.save();
    }

    // -------------------------
    // Timer
    // -------------------------

    let timeRemaining = 0;

    if (election.status === "Active") {
      timeRemaining = Math.max(
        0,
        endDate.getTime() - now.getTime()
      );
    } else if (election.status === "Draft") {
      timeRemaining = Math.max(
        0,
        startDate.getTime() - now.getTime()
      );
    }

    res.json({
      electionId: election._id,
      title: election.title,
      status: election.status,
      resultVisible: election.resultVisible,
      startDate: election.startDate,
      endDate: election.endDate,
      timeRemaining,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error",
    });

  }
});

module.exports = router;
