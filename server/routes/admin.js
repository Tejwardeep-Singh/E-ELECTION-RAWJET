const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const upload = require("../config/cloudinaryUpload");
const multer=require("multer");

// Add candidate
router.post("/candidate/add", upload.fields([
    { name: 'candidateImage', maxCount: 1 },
    { name: 'partyImage', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { id, name, area, criminalCase,city,state } = req.body;
  
      const candidateImage = req.files['candidateImage']?.[0]?.path;
      const partyImage = req.files['partyImage']?.[0]?.path;
  
      if (!candidateImage || !partyImage) {
        return res.status(400).json({ error: "Both images are required" });
      }
  
      const newCandidate = new Candidate({
        id,
        name,
        area,
        candidateImage,
        partyImage,
        city,
        state,
        criminalCase: criminalCase || '',
        voteCount: 0
      });
  
      await newCandidate.save();
      res.status(200).json({ message: "Candidate added successfully" });
    } catch (err) {
      console.error("Error adding candidate:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/candidate/by-area/:area', async (req, res) => {
  try {
    const candidates = await Candidate.find({ area: req.params.area });
    res.json(candidates);
  } catch (err) {
    console.error('Error fetching candidates by area:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// View all candidates
router.get('/candidate/view', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit candidate
router.put('/candidate/edit/:id', upload.single('candidateImage'), async (req, res) => {
  try {
    const update = {
      name: req.body.name,
      area: req.body.area,
      crimminalCase: req.body.crimminalCase,
    };

    if (req.file) {
      update.candidateImage = req.file.path;
    }

    if (req.body.partyImageUrl) {
      update.partyImage = req.body.partyImageUrl; // From frontend if party image not updated
    }

    await Candidate.findByIdAndUpdate(req.params.id, update);
    res.json({ message: "Candidate updated successfully" });
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete candidate
router.delete('/candidate/delete/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
