const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const Candidate = require("../models/candidate");
const electionConfig=require("../models/elections");
const Voter=require("../models/voter");
const bcrypt = require("bcrypt");
const moment = require('moment-timezone'); 
const authenticate = require('../middlewares/authenticate');
const authorizeHead = require('../middlewares/authorizeHead');

router.use(authenticate, authorizeHead);

router.post("/add", async (req, res) => {
  try {
    const { userId, name, password, address } = req.body;

    if (!address?.state || !address?.city || !address?.area) {
      return res.status(400).json({ message: 'State, city, and area are required' });
    }

    const existingAdmin = await Admin.findOne({ userId });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this User ID already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      userId,
      name,
      password: hashedPassword,
      address,
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

  
    const candidates = await Candidate.find({ 'address.area': { $regex: new RegExp(area, 'i') } });

    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates by area:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get("/view", async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
});
router.delete("/delete/:id", async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});
router.put("/edit/:id", async (req, res) => {
  try {
    const { userId, name, password, address } = req.body;
    if (!address?.state || !address?.city || !address?.area) {
      return res.status(400).json({ message: 'State, city, and area are required' });
    }

    const update = { userId, name, address };
    if (password) update.password = await bcrypt.hash(password, 10);

    const admin = await Admin.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json({ message: 'Admin updated successfully', admin });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
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
router.post('/reset-election', async (req, res) => {
  try {
    
    await Candidate.deleteMany({});

    let config = await electionConfig.findOne();
    await Voter.updateMany({}, { $set: { votingStatus: 'not_voted' } });
    config.startTime = null;
      config.endTime = null;
      config.electionLive = false;  
      config.resultVisible=false;  

    res.status(200).json({ message: 'Election reset successfully' });
  } catch (err) {
    console.error('Error resetting election:', err);
    res.status(500).json({ message: 'Server error during reset' });
  }
});
router.post('/set', async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const start = moment.tz(startTime, 'Asia/Kolkata').toDate();
    const end = moment.tz(endTime, 'Asia/Kolkata').toDate();
    let config = await electionConfig.findOne();

    if (config) {
      
      config.startTime = start;
      config.endTime = end;
      config.electionLive = true;  
      config.resultVisible=false;   
    } else {
      
      config = new electionConfig({
        startTime:start,
        endTime:end,
        electionLive: true,         
        resultVisible: false         
      });
    }

    await config.save();
    res.status(200).json({ message: 'Election config saved or updated', config });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
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

