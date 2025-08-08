const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const Candidate = require("../models/candidate");
const electionConfig=require("../models/elections");
const bcrypt = require("bcrypt");
const moment = require('moment-timezone'); 

// POST /api/admins
router.post("/add", async (req, res) => {
  try {
    const { userId, name, password } = req.body;

    const existingAdmin = await Admin.findOne({ userId });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this User ID already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      userId,
      name,
      password: hashedPassword
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get('/candidates/:area', async (req, res) => {
  try {
    const area = req.params.area;

    // Case-insensitive search
    const candidates = await Candidate.find({ area: { $regex: new RegExp(area, 'i') } });

    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates by area:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get all admins
router.get("/view", async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
});

// Delete admin
router.delete("/delete/:id", async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Edit admin
router.put("/edit/:id", async (req, res) => {
  const { userId, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await Admin.findByIdAndUpdate(req.params.id, { userId, name, password: hashedPassword });
  res.sendStatus(200);
});

router.get('/election', async (req, res) => {
  try {
    const config = await electionConfig.findOne();
    if (!config) return res.status(404).json({ message: 'No election config found' });
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route: POST /head/election
// Set or update election timing
router.post('/set', async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const start = moment.tz(startTime, 'Asia/Kolkata').toDate();
    const end = moment.tz(endTime, 'Asia/Kolkata').toDate();
    let config = await electionConfig.findOne();

    if (config) {
      // If a config exists, update its fields
      config.startTime = start;
      config.endTime = end;
      config.electionLive = true;  
      config.resultVisible=false;   // explicitly set to true
    } else {
      // If no config found, create a new one
      config = new electionConfig({
        startTime,
        endTime,
        electionLive: true,          // explicitly set to true
        resultVisible: false         // explicitly set to false
      });
    }

    await config.save();
    res.status(200).json({ message: 'Election config saved or updated', config });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Toggle result visibility manually
router.post('/show-results', async (req, res) => {
  try {
    const config = await electionConfig.findOne();
    if (!config) return res.status(404).json({ message: 'Election config not found' });

    config.resultVisible = true;
    await config.save();

    res.status(200).json({ message: 'Results are now visible to everyone' });
  } catch (err) {
    console.error('Error setting result visibility:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;

